"use client"

import { useState, useEffect } from "react"
import { KidsDashboard } from "@/components/kids-dashboard"
import { ManageKidsModal } from "@/components/manage-kids-modal"
import { useRouter, useSearchParams } from "next/navigation"
import { useKids } from "@/providers/kids-provider"
import { Gender } from "@/types/kids"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowLeft } from "lucide-react"

export default function KidsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { kids, addKid, deleteKid, updateKid } = useKids()

    // Get the selected kid from URL params or localStorage
    const selectedKidId = searchParams.get('kid')
        ? parseInt(searchParams.get('kid')!)
        : localStorage.getItem('lastSelectedKid')
            ? parseInt(localStorage.getItem('lastSelectedKid')!)
            : null

    const handleAddKid = (name: string, birthday: Date, gender: Gender) => {
        addKid(name, birthday, gender)
        // After adding a kid, redirect to their dashboard
        const newKidId = kids.length + 1 // Since we know the new kid will have this ID
        localStorage.setItem('lastSelectedKid', newKidId.toString())
        router.push(`/dashboard?kid=${newKidId}`)
    }

    const handleSelectKid = (kidId: number) => {
        localStorage.setItem('lastSelectedKid', kidId.toString())
        router.push(`/dashboard?kid=${kidId}`)
    }

    const handleUpdateKid = (id: number, name: string, birthday: Date, gender: Gender) => {
        updateKid(id, name, birthday, gender)
    }

    return (
        <main className="container mx-auto p-4">
            {kids.length > 0 && (
                <Button
                    variant="ghost"
                    className="mb-4"
                    onClick={() => router.push('/')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
            )}

            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Welcome to Super Kids!</h1>
                {kids.length === 0 ? (
                    <div className="text-center max-w-2xl">
                        <p className="text-xl text-muted-foreground mb-6">
                            Get started by adding your first super kid! Create a profile for each child to track their daily superhero activities and achievements.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => setIsModalOpen(true)}
                            className="gap-2"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Add Your First Super Kid
                        </Button>
                    </div>
                ) : (
                    <div className="text-center max-w-2xl">
                        <p className="text-muted-foreground mb-4">
                            Select a super kid's card to view their activities, or add another super kid to your team. Each super kid gets their own set of exciting daily activities!
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const lastKid = localStorage.getItem('lastSelectedKid')
                                    router.push(lastKid ? `/dashboard?kid=${lastKid}` : '/dashboard')
                                }}
                                className="gap-2"
                            >
                                Return to Dashboard
                            </Button>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="gap-2"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Add Another Super Kid
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {kids.length > 0 && (
                <KidsDashboard
                    kids={kids}
                    onDeleteKid={deleteKid}
                    onAddKid={() => setIsModalOpen(true)}
                    onSelectKid={handleSelectKid}
                    onUpdateKid={handleUpdateKid}
                    selectedKid={selectedKidId}
                    selectedDate={new Date()}
                />
            )}

            <ManageKidsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddKid={handleAddKid}
            />
        </main>
    )
} 