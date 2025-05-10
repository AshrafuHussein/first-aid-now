"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, User, LogOut } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/providers/local-storage-provider"

export function ResponderLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser } = useLocalStorage()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.role !== "responder") {
      toast({
        title: "Access denied",
        description: "You don't have access to this area",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [currentUser, router, toast])

  const handleSignOut = () => {
    setCurrentUser(null)
    router.push("/")
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/responder/dashboard" className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="font-bold">FirstAidNow</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign out</span>
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-muted/40">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} FirstAidNow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
