"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Kid, HeroType, AvatarStyle } from "@/types/kids"
import { AVATAR_COLORS } from "@/components/ui/color-picker"
import { AVATAR_STYLES } from "@/components/ui/avatar-style-picker"

interface KidsContextType {
    kids: Kid[]
    addKid: (name: string, birthday: Date, hero_type: HeroType, backgroundColor: string, avatarStyle: AvatarStyle) => void
    deleteKid: (id: number) => void
    updateKidActivities: (kidId: number, date: string, activities: number[]) => void
    updateKid: (id: number, name: string, birthday: Date, hero_type: HeroType, backgroundColor: string, avatarStyle: AvatarStyle) => void
}

const KidsContext = createContext<KidsContextType | undefined>(undefined)

function getInitialKids(): Kid[] {
    if (typeof window === 'undefined') return []

    try {
        const savedKids = window.localStorage.getItem('kids')
        if (savedKids) {
            const parsedKids = JSON.parse(savedKids)
            console.log('Loading kids from localStorage:', parsedKids)
            const mappedKids = parsedKids.map((kid: any) => {
                const mappedKid = {
                    ...kid,
                    birthday: new Date(kid.birthday),
                    backgroundColor: kid.backgroundColor || AVATAR_COLORS[0].value,
                    avatarStyle: kid.avatarStyle || AVATAR_STYLES[0].value
                }
                console.log('Mapped kid with avatar style:', mappedKid)
                return mappedKid
            })
            return mappedKids
        }
    } catch (error) {
        console.error('Error loading kids from localStorage:', error)
    }
    return []
}

export function KidsProvider({ children }: { children: React.ReactNode }) {
    const [kids, setKids] = useState<Kid[]>([])
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const initialKids = getInitialKids()
            setKids(initialKids)
            setIsInitialized(true)
        }
    }, [])

    useEffect(() => {
        if (isInitialized && typeof window !== 'undefined') {
            try {
                console.log('Saving kids to localStorage:', kids)
                window.localStorage.setItem('kids', JSON.stringify(kids))
            } catch (error) {
                console.error('Error saving kids to localStorage:', error)
            }
        }
    }, [kids, isInitialized])

    const addKid = (name: string, birthday: Date, hero_type: HeroType, backgroundColor: string, avatarStyle: AvatarStyle) => {
        const newKid = {
            id: kids.length + 1,
            name,
            birthday,
            hero_type,
            backgroundColor,
            avatarStyle,
            completedActivities: {}
        }
        setKids(prev => [...prev, newKid])
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('lastSelectedKid', newKid.id.toString())
        }
    }

    const deleteKid = (id: number) => {
        setKids(prev => prev.filter(kid => kid.id !== id))
        if (typeof window !== 'undefined') {
            const lastSelectedKid = window.localStorage.getItem('lastSelectedKid')
            if (lastSelectedKid && parseInt(lastSelectedKid) === id) {
                window.localStorage.removeItem('lastSelectedKid')
            }
        }
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

    const updateKid = (id: number, name: string, birthday: Date, hero_type: HeroType, backgroundColor: string, avatarStyle: AvatarStyle) => {
        console.log('Updating kid with data:', { id, name, backgroundColor, avatarStyle })
        setKids(prev => {
            const newKids = prev.map(kid => {
                if (kid.id === id) {
                    const updatedKid = {
                        ...kid,
                        name,
                        birthday,
                        hero_type,
                        backgroundColor,
                        avatarStyle
                    }
                    console.log('Updated kid object:', updatedKid)
                    return updatedKid
                }
                return kid
            })
            console.log('New kids array after update:', newKids)
            return newKids
        })
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