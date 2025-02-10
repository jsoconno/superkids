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
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Manage Your Super Kids</h1>
                {kids.length === 0 ? (
                    <div className="text-center max-w-2xl">
                        <p className="text-xl text-muted-foreground mb-6">
                            This is where you create profiles for your children. Each profile lets you:
                        </p>
                        <ul className="text-left text-lg text-muted-foreground mb-8 space-y-3">
                            <li>• Track daily superhero-themed activities</li>
                            <li>• Monitor progress and achievements</li>
                            <li>• Get age-appropriate activity suggestions</li>
                            <li>• Customize their superhero appearance</li>
                        </ul>
                        <Button
                            size="lg"
                            onClick={() => setIsModalOpen(true)}
                            className="gap-2"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Create Your First Super Kid
                        </Button>
                    </div>
                ) : (
                    <div className="text-center max-w-2xl">
                        <p className="text-lg text-muted-foreground mb-6">
                            Here you can manage your super kids&apos; profiles and switch between their activity dashboards. Click a card to view that super kid&apos;s activities, or add another super kid to your team.
                        </p>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="gap-2 mb-8"
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