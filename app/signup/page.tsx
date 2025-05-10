"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Heart } from "lucide-react"
import { useLocalStorage } from "@/providers/local-storage-provider"
import { v4 as uuidv4 } from "uuid"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"patient" | "responder">("patient")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { addUser, setCurrentUser, getUserByEmail } = useLocalStorage()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Check if user already exists
      const existingUser = getUserByEmail(email)
      if (existingUser) {
        toast({
          title: "Error",
          description: "User with this email already exists",
          variant: "destructive",
        })
        return
      }

      // Create new user
      const newUser = {
        uid: uuidv4(),
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
      }

      // Add user to local storage
      addUser(newUser)

      // Set as current user
      setCurrentUser(newUser)

      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      })

      // Redirect based on role
      if (role === "patient") {
        router.push("/patient/dashboard")
      } else {
        router.push("/responder/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
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
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
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
            <div className="grid gap-2">
              <Label>I am a:</Label>
              <RadioGroup
                defaultValue="patient"
                value={role}
                onValueChange={(value) => setRole(value as "patient" | "responder")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient">Patient seeking help</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="responder" id="responder" />
                  <Label htmlFor="responder">Health Personnel</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Sign in
        </Link>
      </p>
    </div>
  )
}
