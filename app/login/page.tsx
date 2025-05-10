"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Heart } from "lucide-react"
import { useLocalStorage } from "@/providers/local-storage-provider"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { getUserByEmail, setCurrentUser } = useLocalStorage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Find user by email
      const user = getUserByEmail(email)

      if (!user) {
        toast({
          title: "Login failed",
          description: "User not found",
          variant: "destructive",
        })
        return
      }

      // In a real app, we would check the password hash here
      // For this prototype, we'll just simulate successful login

      // Set current user
      setCurrentUser(user)

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      })

      // Redirect based on role
      if (user.role === "patient") {
        router.push("/patient/dashboard")
      } else {
        router.push("/responder/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center">
        <Heart className="h-6 w-6 text-red-500" />
        <span className="ml-2 font-bold">FirstAidNow</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Enter your email and password to sign in to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
          Sign up
        </Link>
      </p>
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">Demo Accounts:</p>
        <p className="text-xs text-muted-foreground">Patient: patient@example.com</p>
        <p className="text-xs text-muted-foreground">Responder: responder@example.com</p>
        <p className="text-xs text-muted-foreground">(Any password will work)</p>
      </div>
    </div>
  )
}
