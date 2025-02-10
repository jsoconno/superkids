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

    const handleSaveKid = (name: string, birthday: Date, hero_type: HeroType, backgroundColor: string, avatarStyle: AvatarStyle) => {
        if (editingKidId) {
            // Update existing kid
            updateKid(editingKidId, name, birthday, hero_type, backgroundColor, avatarStyle)
            setEditingKidId(null)
        } else {
            // Add new kid
            addKid(name, birthday, hero_type, backgroundColor, avatarStyle)
            // After adding a kid, redirect to their dashboard
            const newKidId = kids.length + 1 // Since we know the new kid will have this ID
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('lastSelectedKid', newKidId.toString())
            }
            router.push(`/dashboard?kid=${newKidId}`)
        }
        setIsModalOpen(false)
    }

    const handleSelectKid = (kidId: number) => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('lastSelectedKid', kidId.toString())
        }
        router.push(`/dashboard?kid=${kidId}`)
    }

    // Track which kid is being edited
    const [editingKidId, setEditingKidId] = useState<number | null>(null)

    return (
        <main className="container mx-auto p-4">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Manage Your Super Kids</h1>
                {kids.length === 0 ? (
                    <div className="text-center max-w-2xl">
                        <p className="text-xl text-muted-foreground mb-8">
                            Create a profile for your child to track their daily activities, monitor progress, and get personalized superhero adventures.
                        </p>
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
                    onUpdateKid={(name, birthday, hero_type, backgroundColor, avatarStyle) => {
                        if (editingKidId) {
                            updateKid(editingKidId, name, birthday, hero_type, backgroundColor, avatarStyle)
                            setEditingKidId(null)
                        }
                    }}
                    selectedKid={selectedKidId}
                    selectedDate={new Date()}
                    onEditKid={(kidId) => setEditingKidId(kidId)}
                />
            )}

            <ManageKidsModal
                isOpen={isModalOpen || editingKidId !== null}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingKidId(null)
                }}
                onSave={handleSaveKid}
                kid={editingKidId ? kids.find(k => k.id === editingKidId) : undefined}
            />
        </main>
    )
}

export default function KidsPage() {
    return (
        <Suspense>
            <KidsPageContent />
        </Suspense>
    )
} 