"use client"

import { useState, useEffect, Suspense } from "react"
import { KidsDashboard } from "@/components/kids-dashboard"
import { ManageKidsModal } from "@/components/manage-kids-modal"
import { useRouter, useSearchParams } from "next/navigation"
import { useKids } from "@/providers/kids-provider"
import { HeroType, AvatarStyle } from "@/types/kids"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowLeft } from "lucide-react"

function KidsPageContent() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { kids, addKid, deleteKid, updateKid } = useKids()

    // Get the selected kid from URL params or localStorage
    const selectedKidId = searchParams.get('kid')
        ? parseInt(searchParams.get('kid')!)
        : typeof window !== 'undefined' && window.localStorage.getItem('lastSelectedKid')
            ? parseInt(window.localStorage.getItem('lastSelectedKid')!)
            : null

    const handleAddKid = (name: string, birthday: Date, hero_type: HeroType, backgroundColor: string, avatarStyle: AvatarStyle) => {
        console.log('handleAddKid called with:', { name, hero_type, backgroundColor, avatarStyle })
        addKid(name, birthday, hero_type, backgroundColor, avatarStyle)
        // After adding a kid, redirect to their dashboard
        const newKidId = kids.length + 1 // Since we know the new kid will have this ID
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('lastSelectedKid', newKidId.toString())
        }
        router.push(`/dashboard?kid=${newKidId}`)
    }

    const handleSelectKid = (kidId: number) => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('lastSelectedKid', kidId.toString())
        }
        router.push(`/dashboard?kid=${kidId}`)
    }

    const handleUpdateKid = (id: number, name: string, birthday: Date, hero_type: HeroType, backgroundColor: string, avatarStyle: AvatarStyle) => {
        console.log('handleUpdateKid called with:', { id, name, hero_type, backgroundColor, avatarStyle })
        updateKid(id, name, birthday, hero_type, backgroundColor, avatarStyle)
    }

    return (
        <main className="container mx-auto p-4">
            {kids.length > 0 && (
                <Button
                    variant="ghost"
                    className="mb-4"
                    onClick={() => router.push('/dashboard')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Activities
                </Button>
            )}

            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Welcome to Super Kids!</h1>
                {kids.length === 0 ? (
                    <div className="text-center max-w-2xl">
                        <p className="text-xl text-muted-foreground mb-6">
                            Get started by adding your first super kid! Create a profile for each child to track their daily superhero activities and achievements!
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
                            Select a super kid&apos;s card to view their activities, or add another super kid to your team. Each super kid gets their own set of exciting daily activities!
                        </p>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="gap-2"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Add Another Super Kid
                        </Button>
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

export default function KidsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <KidsPageContent />
        </Suspense>
    )
} 