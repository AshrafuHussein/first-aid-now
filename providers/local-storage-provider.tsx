"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

// Types
export type User = {
  uid: string
  email: string
  name: string
  role: "patient" | "responder"
  createdAt: string
}

export type EmergencyRequest = {
  id: string
  userId: string
  userName: string
  emergencyType: string
  message: string
  location: { lat: number; lng: number }
  status: "pending" | "accepted" | "completed"
  createdAt: string
  updatedAt: string
  responderId?: string
  responderName?: string
  completedAt?: string
}

type LocalStorageContextType = {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  users: User[]
  addUser: (user: User) => void
  emergencyRequests: EmergencyRequest[]
  addEmergencyRequest: (request: EmergencyRequest) => void
  updateEmergencyRequest: (id: string, updates: Partial<EmergencyRequest>) => void
  getUserByEmail: (email: string) => User | undefined
  getRequestsByUserId: (userId: string) => EmergencyRequest[]
  getRequestsByStatus: (status: EmergencyRequest["status"]) => EmergencyRequest[]
  getRequestsByResponder: (responderId: string) => EmergencyRequest[]
}

const LocalStorageContext = createContext<LocalStorageContextType | null>(null)

export function LocalStorageProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("users")
    const storedRequests = localStorage.getItem("emergencyRequests")
    const storedCurrentUser = localStorage.getItem("currentUser")

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    } else {
      // Add some demo users if none exist
      const demoUsers: User[] = [
        {
          uid: "patient1",
          email: "patient@example.com",
          name: "John Patient",
          role: "patient",
          createdAt: new Date().toISOString(),
        },
        {
          uid: "responder1",
          email: "responder@example.com",
          name: "Jane Responder",
          role: "responder",
          createdAt: new Date().toISOString(),
        },
      ]
      setUsers(demoUsers)
      localStorage.setItem("users", JSON.stringify(demoUsers))
    }

    if (storedRequests) {
      setEmergencyRequests(JSON.parse(storedRequests))
    }

    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser))
    }

    setIsInitialized(true)
  }, [])

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("users", JSON.stringify(users))
    }
  }, [users, isInitialized])

  // Save emergency requests to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("emergencyRequests", JSON.stringify(emergencyRequests))
    }
  }, [emergencyRequests, isInitialized])

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      if (currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
      } else {
        localStorage.removeItem("currentUser")
      }
    }
  }, [currentUser, isInitialized])

  // User management functions
  const addUser = (user: User) => {
    setUsers((prevUsers) => [...prevUsers, user])
  }

  const getUserByEmail = (email: string) => {
    return users.find((user) => user.email === email)
  }

  // Emergency request management functions
  const addEmergencyRequest = (request: EmergencyRequest) => {
    setEmergencyRequests((prevRequests) => [...prevRequests, request])
  }

  const updateEmergencyRequest = (id: string, updates: Partial<EmergencyRequest>) => {
    setEmergencyRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, ...updates, updatedAt: new Date().toISOString() } : request,
      ),
    )
  }

  const getRequestsByUserId = (userId: string) => {
    return emergencyRequests.filter((request) => request.userId === userId)
  }

  const getRequestsByStatus = (status: EmergencyRequest["status"]) => {
    return emergencyRequests.filter((request) => request.status === status)
  }

  const getRequestsByResponder = (responderId: string) => {
    return emergencyRequests.filter((request) => request.responderId === responderId)
  }

  return (
    <LocalStorageContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        emergencyRequests,
        addEmergencyRequest,
        updateEmergencyRequest,
        getUserByEmail,
        getRequestsByUserId,
        getRequestsByStatus,
        getRequestsByResponder,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  )
}

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext)
  if (!context) {
    throw new Error("useLocalStorage must be used within a LocalStorageProvider")
  }
  return context
}
