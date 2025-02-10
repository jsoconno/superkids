"use client"

import { useState, useEffect, Suspense } from "react"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { ActivityList } from "@/components/activity-list"
import { ProgressChart } from "@/components/progress-chart"
import { format, differenceInYears, getDay, parseISO } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { useKids } from "@/providers/kids-provider"
import { superheroActivities } from "@/data/superhero-activities"
import { getActivitiesForDate } from "@/utils/activity-utils"
import { WeeklyProgress } from "@/components/weekly-progress"

function DashboardContent() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const router = useRouter()
    const searchParams = useSearchParams()
    const { kids, updateKidActivities } = useKids()

    // Get selected kid from URL params or localStorage
    const selectedKidId = searchParams.get('kid')
        ? parseInt(searchParams.get('kid')!)
        : typeof window !== 'undefined' && window.localStorage.getItem('lastSelectedKid')
            ? parseInt(window.localStorage.getItem('lastSelectedKid')!)
            : null

    const selectedKid = kids.find(k => k.id === selectedKidId)

    // Load last selected date from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedDate = window.localStorage.getItem('lastSelectedDate')
            if (savedDate) {
                setSelectedDate(parseISO(savedDate))
            }
        }
    }, [])

    // Save selected date to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('lastSelectedDate', format(selectedDate, "yyyy-MM-dd"))
        }
    }, [selectedDate])

    // Redirect to /kids if no kids exist or no kid is selected
    useEffect(() => {
        if (kids.length === 0 || (!selectedKidId && kids.length > 0)) {
            if (typeof window !== 'undefined') {
                const lastSelectedKid = window.localStorage.getItem('lastSelectedKid')
                if (lastSelectedKid && kids.some(k => k.id === parseInt(lastSelectedKid))) {
                    router.push(`/dashboard?kid=${lastSelectedKid}`)
                } else {
                    router.push('/kids')
                }
            }
        }
    }, [selectedKidId, kids, router])

    // Save selected kid to localStorage whenever it changes
    useEffect(() => {
        if (selectedKidId && typeof window !== 'undefined') {
            window.localStorage.setItem('lastSelectedKid', selectedKidId.toString())
        }
    }, [selectedKidId])

    const toggleActivity = (kidId: number, activityId: number, date: Date) => {
        const dateKey = format(date, "yyyy-MM-dd")
        const currentActivities = selectedKid?.completedActivities[dateKey] || []
        const activityIndex = currentActivities.indexOf(activityId)

        let newActivities: number[]
        if (activityIndex > -1) {
            newActivities = currentActivities.filter(id => id !== activityId)
        } else {
            newActivities = [...currentActivities, activityId]
        }

        updateKidActivities(kidId, dateKey, newActivities)
    }

    if (!selectedKid) {
        return null // Will redirect to /kids
    }

    const kidAge = differenceInYears(new Date(), selectedKid.birthday)
    const dayOfWeek = getDay(selectedDate)

    const dailyActivities = getActivitiesForDate(selectedDate, superheroActivities || [], kidAge)
    const activitiesForList = Array.isArray(dailyActivities) ? dailyActivities : []

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">
                    {selectedKid.name}&apos;s Activities
                </h1>
                <Button variant="outline" onClick={() => router.push('/kids')}>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Kids
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2">
                    <ActivityList
                        activities={activitiesForList}
                        completedActivities={selectedKid.completedActivities[format(selectedDate, "yyyy-MM-dd")] || []}
                        onToggle={(activityId) => toggleActivity(selectedKid.id, activityId, selectedDate)}
                        selectedDate={selectedDate}
                        kidAge={selectedKid.birthday}
                    />
                </div>
                <div className="flex flex-col gap-8">
                    <div className="flex justify-center md:justify-start">
                        <WeeklyCalendar
                            selectedDate={selectedDate}
                            onSelectDate={(date) => setSelectedDate(date || new Date())}
                            selectedKid={selectedKid}
                        />
                    </div>
                    <WeeklyProgress kid={selectedKid} selectedDate={selectedDate} />
                    <ProgressChart kid={selectedKid} />
                </div>
            </div>
        </main>
    )
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    )
} 