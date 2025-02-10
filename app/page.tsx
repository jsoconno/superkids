"use client"

import { useState, useEffect } from "react"
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

// Immediately check if superhero activities are loaded
console.log("TRACE - Superhero activities import:", {
  count: superheroActivities?.length || 0,
  firstActivity: superheroActivities?.[0],
  isArray: Array.isArray(superheroActivities),
  isExported: typeof superheroActivities !== 'undefined'
})

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const router = useRouter()
  const searchParams = useSearchParams()
  const { kids, updateKidActivities } = useKids()

  // Get selected kid from URL or localStorage
  const selectedKidId = searchParams.get('kid')
    ? parseInt(searchParams.get('kid')!)
    : null
  const selectedKid = kids.find(k => k.id === selectedKidId)

  // Load last selected date from localStorage on mount
  useEffect(() => {
    const savedDate = localStorage.getItem('lastSelectedDate')
    if (savedDate) {
      setSelectedDate(parseISO(savedDate))
    }
  }, [])

  // Save selected date to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lastSelectedDate', format(selectedDate, "yyyy-MM-dd"))
  }, [selectedDate])

  // If no kid is selected, try to get last selected kid from localStorage
  useEffect(() => {
    if (!selectedKidId && kids.length > 0) {
      const lastSelectedKid = localStorage.getItem('lastSelectedKid')
      if (lastSelectedKid) {
        const kidId = parseInt(lastSelectedKid)
        if (kids.some(k => k.id === kidId)) {
          router.push(`/?kid=${kidId}`)
        } else {
          router.push('/kids')
        }
      } else {
        router.push('/kids')
      }
    }
  }, [selectedKidId, kids, router])

  // Save selected kid to localStorage whenever it changes
  useEffect(() => {
    if (selectedKidId) {
      localStorage.setItem('lastSelectedKid', selectedKidId.toString())
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

  // Log more details about the current state
  console.log("TRACE - Current state:", {
    kidAge,
    selectedDate: format(selectedDate, "yyyy-MM-dd"),
    dayOfWeek,
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    superheroActivitiesAvailable: superheroActivities?.length > 0,
    selectedKidName: selectedKid.name,
    selectedKidBirthday: format(selectedKid.birthday, "yyyy-MM-dd")
  })

  const dailyActivities = getActivitiesForDate(selectedDate, superheroActivities || [], kidAge)
  console.log("TRACE - Daily activities:", {
    hasActivities: dailyActivities?.length > 0,
    activities: dailyActivities,
    selectedDate: format(selectedDate, "yyyy-MM-dd"),
    dayOfWeek,
    kidAge
  })

  // Ensure we always pass an array, even if empty
  const activitiesForList = Array.isArray(dailyActivities) ? dailyActivities : []
  console.log("TRACE - Activities for list:", {
    hasActivities: activitiesForList.length > 0,
    activities: activitiesForList
  })

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          {selectedKid.name}'s Activities
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

