import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Shield, Clock, MapPin } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="font-bold">FirstAidNow</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Emergency First Aid When You Need It Most
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Connect with nearby health personnel for immediate first aid assistance in emergencies.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-red-500 hover:bg-red-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <Clock className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold">Quick Response</h3>
                <p className="text-muted-foreground">
                  Request immediate assistance from nearby health personnel with just a few taps.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <MapPin className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold">Location Sharing</h3>
                <p className="text-muted-foreground">
                  Automatically share your location to help responders find you quickly.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold">Verified Responders</h3>
                <p className="text-muted-foreground">
                  All health personnel are verified to ensure you receive proper care.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
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
