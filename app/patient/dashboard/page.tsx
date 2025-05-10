"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, MapPin, AlertCircle } from "lucide-react"
import { PatientLayout } from "@/components/layouts/patient-layout"
import { Badge } from "@/components/ui/badge"
import { useLocalStorage } from "@/providers/local-storage-provider"
import { v4 as uuidv4 } from "uuid"

export default function PatientDashboard() {
  const { currentUser, addEmergencyRequest, getRequestsByUserId } = useLocalStorage()
  const [emergencyType, setEmergencyType] = useState("")
  const [message, setMessage] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeRequests, setActiveRequests] = useState<any[]>([])
  const { toast } = useToast()

  // Load active requests
  useEffect(() => {
    if (currentUser) {
      const requests = getRequestsByUserId(currentUser.uid).filter(
        (req) => req.status === "pending" || req.status === "accepted",
      )
      setActiveRequests(requests)
    }
  }, [currentUser, getRequestsByUserId])

  const getLocation = () => {
    setGettingLocation(true)

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      })
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setGettingLocation(false)

        toast({
          title: "Location captured",
          description: "Your current location has been captured successfully",
        })
      },
      (error) => {
        toast({
          title: "Error",
          description: `Failed to get your location: ${error.message}`,
          variant: "destructive",
        })
        setGettingLocation(false)
      },
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emergencyType) {
      toast({
        title: "Error",
        description: "Please enter the emergency type",
        variant: "destructive",
      })
      return
    }

    if (!location) {
      toast({
        title: "Error",
        description: "Please capture your location",
        variant: "destructive",
      })
      return
    }

    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a request",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      // Create emergency request
      const newRequest = {
        id: uuidv4(),
        userId: currentUser.uid,
        userName: currentUser.name,
        emergencyType,
        message: message || "",
        location,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      addEmergencyRequest(newRequest)

      // Update local state to show the new request
      setActiveRequests((prev) => [...prev, newRequest])

      toast({
        title: "Request sent",
        description: "Your emergency request has been sent successfully",
      })

      // Reset form
      setEmergencyType("")
      setMessage("")
      setLocation(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send request",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PatientLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Request First Aid</h1>

        {activeRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Requests</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {activeRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {request.emergencyType}
                      <Badge variant={request.status === "pending" ? "outline" : "default"}>
                        {request.status === "pending" ? "Pending" : "Accepted"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{new Date(request.createdAt).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {request.message && <p className="mb-2">{request.message}</p>}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>Location shared</span>
                    </div>
                  </CardContent>
                  {request.status === "accepted" && request.responderName && (
                    <CardFooter>
                      <p className="text-sm">
                        <span className="font-medium">{request.responderName}</span> is on the way to help you
                      </p>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>New Emergency Request</CardTitle>
            <CardDescription>Fill in the details below to request immediate first aid assistance</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyType">Emergency Type</Label>
                <Input
                  id="emergencyType"
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  placeholder="e.g., Bleeding, Burns, Choking"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Additional Details (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide any additional information that might help the responder"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Your Location</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getLocation}
                    disabled={gettingLocation}
                    className="flex items-center gap-2"
                  >
                    {gettingLocation ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Getting location...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4" />
                        {location ? "Update Location" : "Get My Location"}
                      </>
                    )}
                  </Button>
                  {location && <span className="text-sm text-green-600">Location captured</span>}
                </div>
                {!location && (
                  <p className="text-sm flex items-center text-amber-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Location is required to send an emergency request
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={submitting || !location}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  "Send Emergency Request"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PatientLayout>
  )
}
