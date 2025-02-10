"use client"

import { useState } from "react"
import { KidsDashboard } from "@/components/kids-dashboard"
import { ManageKidsModal } from "@/components/manage-kids-modal"
import { useRouter, useSearchParams } from "next/navigation"
import { useKids } from "@/providers/kids-provider"
import { Gender } from "@/types/kids"

export default function KidsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { kids, addKid, deleteKid, updateKid } = useKids()

    // Get the selected kid from the URL params
    const selectedKidId = searchParams.get('kid') ? parseInt(searchParams.get('kid')!) : null
    const selectedKid = kids.find(k => k.id === selectedKidId)

    const handleAddKid = (name: string, birthday: Date, gender: Gender) => {
        addKid(name, birthday, gender)
        // After adding a kid, redirect to their dashboard
        const newKidId = kids.length + 1 // Since we know the new kid will have this ID
        router.push(`/?kid=${newKidId}`)
    }

    const handleSelectKid = (kidId: number) => {
        router.push(`/?kid=${kidId}`)
    }

    const handleUpdateKid = (id: number, name: string, birthday: Date, gender: Gender) => {
        updateKid(id, name, birthday, gender)
    }

    return (
        <main className="container mx-auto p-4">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl font-bold mb-2">Super Kids</h1>
                <p className="text-muted-foreground text-center max-w-md">
                    Click a super kid's card to view their activities, or add a new super kid to get started. Each super kid gets their own set of daily activities!
                </p>
            </div>

            <KidsDashboard
                kids={kids}
                onDeleteKid={deleteKid}
                onAddKid={() => setIsModalOpen(true)}
                onSelectKid={handleSelectKid}
                onUpdateKid={handleUpdateKid}
                selectedKid={selectedKidId}
                selectedDate={new Date()}
            />

            <ManageKidsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddKid={handleAddKid}
            />
        </main>
    )
} 