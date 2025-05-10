"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, MapPin, Clock, CheckCircle } from "lucide-react"
import { ResponderLayout } from "@/components/layouts/responder-layout"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/providers/local-storage-provider"

export default function ResponderDashboard() {
  const { currentUser, getRequestsByStatus, getRequestsByResponder, updateEmergencyRequest } = useLocalStorage()
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [acceptedRequests, setAcceptedRequests] = useState<any[]>([])
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null)
  const { toast } = useToast()

  // Load requests
  useEffect(() => {
    if (currentUser) {
      // Get pending requests
      const pending = getRequestsByStatus("pending")
      setPendingRequests(pending)

      // Get accepted requests by this responder
      const accepted = getRequestsByResponder(currentUser.uid)
      setAcceptedRequests(accepted)
    }
  }, [currentUser, getRequestsByStatus, getRequestsByResponder])

  const handleAcceptRequest = async (requestId: string) => {
    if (!currentUser) return

    try {
      setProcessingRequestId(requestId)

      // Update request status
      updateEmergencyRequest(requestId, {
        status: "accepted",
        responderId: currentUser.uid,
        responderName: currentUser.name,
      })

      // Update local state
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId))

      const acceptedRequest = pendingRequests.find((req) => req.id === requestId)
      if (acceptedRequest) {
        const updatedRequest = {
          ...acceptedRequest,
          status: "accepted",
          responderId: currentUser.uid,
          responderName: currentUser.name,
          updatedAt: new Date().toISOString(),
        }
        setAcceptedRequests((prev) => [...prev, updatedRequest])
      }

      toast({
        title: "Request accepted",
        description: "You have accepted the emergency request",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept request",
        variant: "destructive",
      })
    } finally {
      setProcessingRequestId(null)
    }
  }

  const handleCompleteRequest = async (requestId: string) => {
    try {
      setProcessingRequestId(requestId)

      // Update request status
      updateEmergencyRequest(requestId, {
        status: "completed",
        completedAt: new Date().toISOString(),
      })

      // Update local state
      setAcceptedRequests((prev) => prev.filter((req) => req.id !== requestId))

      toast({
        title: "Request completed",
        description: "The emergency request has been marked as completed",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete request",
        variant: "destructive",
      })
    } finally {
      setProcessingRequestId(null)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins === 1) return "1 minute ago"
    if (diffMins < 60) return `${diffMins} minutes ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours === 1) return "1 hour ago"
    if (diffHours < 24) return `${diffHours} hours ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
  }

  const getGoogleMapsUrl = (location: { lat: number; lng: number }) => {
    return `https://www.google.com/maps?q=${location.lat},${location.lng}`
  }

  return (
    <ResponderLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Responder Dashboard</h1>

        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending Requests
              {pendingRequests.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="accepted">
              My Active Responses
              {acceptedRequests.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {acceptedRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No pending emergency requests at the moment.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{request.emergencyType}</CardTitle>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <CardDescription className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {formatTimeAgo(request.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-medium">From: {request.userName}</p>
                        {request.message && <p className="text-sm text-muted-foreground">{request.message}</p>}
                        <div className="pt-2">
                          <a
                            href={getGoogleMapsUrl(request.location)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <MapPin className="mr-1 h-4 w-4" />
                            View on Google Maps
                          </a>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleAcceptRequest(request.id)}
                        disabled={processingRequestId === request.id}
                      >
                        {processingRequestId === request.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Accepting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept Request
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted">
            {acceptedRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  You haven't accepted any emergency requests yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {acceptedRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{request.emergencyType}</CardTitle>
                        <Badge>Active</Badge>
                      </div>
                      <CardDescription className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {formatTimeAgo(request.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-medium">Patient: {request.userName}</p>
                        {request.message && <p className="text-sm text-muted-foreground">{request.message}</p>}
                        <div className="pt-2">
                          <a
                            href={getGoogleMapsUrl(request.location)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <MapPin className="mr-1 h-4 w-4" />
                            View on Google Maps
                          </a>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleCompleteRequest(request.id)}
                        disabled={processingRequestId === request.id}
                      >
                        {processingRequestId === request.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Completing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ResponderLayout>
  )
}
