"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Kid, Gender } from "@/types/kids"

interface KidsContextType {
    kids: Kid[]
    addKid: (name: string, birthday: Date, gender: Gender) => void
    deleteKid: (id: number) => void
    updateKidActivities: (kidId: number, date: string, activities: number[]) => void
    updateKid: (id: number, name: string, birthday: Date, gender: Gender) => void
}

const KidsContext = createContext<KidsContextType | undefined>(undefined)

function getInitialKids(): Kid[] {
    // Only run this on the client side
    if (typeof window === 'undefined') return []

    try {
        const savedKids = localStorage.getItem('kids')
        if (savedKids) {
            const parsedKids = JSON.parse(savedKids)
            // Convert date strings back to Date objects
            parsedKids.forEach((kid: any) => {
                kid.birthday = new Date(kid.birthday)
            })
            return parsedKids
        }
    } catch (error) {
        console.error('Error loading kids from localStorage:', error)
    }
    return []
}

export function KidsProvider({ children }: { children: React.ReactNode }) {
    const [kids, setKids] = useState<Kid[]>([])
    const [isInitialized, setIsInitialized] = useState(false)

    // Load kids from localStorage on mount
    useEffect(() => {
        const initialKids = getInitialKids()
        setKids(initialKids)
        setIsInitialized(true)
    }, [])

    // Save kids to localStorage whenever they change
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem('kids', JSON.stringify(kids))
            } catch (error) {
                console.error('Error saving kids to localStorage:', error)
            }
        }
    }, [kids, isInitialized])

    const addKid = (name: string, birthday: Date, gender: Gender) => {
        setKids(prev => [...prev, {
            id: prev.length + 1,
            name,
            birthday,
            gender,
            completedActivities: {}
        }])
    }

    const deleteKid = (id: number) => {
        setKids(prev => prev.filter(kid => kid.id !== id))
    }

    const updateKidActivities = (kidId: number, date: string, activities: number[]) => {
        setKids(prev => prev.map(kid => {
            if (kid.id === kidId) {
                return {
                    ...kid,
                    completedActivities: {
                        ...kid.completedActivities,
                        [date]: activities
                    }
                }
            }
            return kid
        }))
    }

    const updateKid = (id: number, name: string, birthday: Date, gender: Gender) => {
        setKids(prev => prev.map(kid => {
            if (kid.id === id) {
                return {
                    ...kid,
                    name,
                    birthday,
                    gender
                }
            }
            return kid
        }))
    }

    return (
        <KidsContext.Provider value={{ kids, addKid, deleteKid, updateKidActivities, updateKid }}>
            {children}
        </KidsContext.Provider>
    )
}

export function useKids() {
    const context = useContext(KidsContext)
    if (context === undefined) {
        throw new Error('useKids must be used within a KidsProvider')
    }
    return context
} 