import { SuperheroActivity } from "@/data/superhero-activities"
import { format, getDay, startOfMonth, differenceInDays } from "date-fns"

export function getActivitiesForDate(date: Date, activities: SuperheroActivity[], kidAge: number): SuperheroActivity[] {
    console.log("TRACE - getActivitiesForDate input:", {
        date: format(date, "yyyy-MM-dd"),
        totalActivities: activities.length,
        kidAge,
        firstActivity: activities[0]
    })

    // Only return activities for Monday (1) through Friday (5)
    const dayOfWeek = getDay(date)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        console.log("TRACE - Weekend detected - no activities:", { dayOfWeek })
        return []
    }

    // For very young kids (0-2 years), use activities with minAge of 3
    const effectiveAge = kidAge < 3 ? 3 : kidAge

    // Filter activities by age appropriateness
    const ageAppropriateActivities = activities.filter(activity => activity.minAge <= effectiveAge)

    if (ageAppropriateActivities.length === 0) {
        console.log("TRACE - No age-appropriate activities found")
        return []
    }

    // Calculate how many weekdays have passed since the start of the month
    const monthStart = startOfMonth(date)
    let weekdayCount = 0
    for (let i = 0; i < differenceInDays(date, monthStart); i++) {
        const currentDate = new Date(monthStart)
        currentDate.setDate(monthStart.getDate() + i)
        const currentDay = getDay(currentDate)
        if (currentDay !== 0 && currentDay !== 6) {
            weekdayCount++
        }
    }

    // Use the weekday count to cycle through activities
    // This ensures we go through all activities before repeating
    const activityIndex = weekdayCount % ageAppropriateActivities.length

    // Create a deterministic shuffle for the month to vary the order
    const monthKey = format(date, "yyyy-MM")
    const monthSeed = Array.from(monthKey).reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Shuffle activities at the start of each month
    const shuffledActivities = [...ageAppropriateActivities]
        .sort((a, b) => {
            const seedA = (a.id * monthSeed) % ageAppropriateActivities.length
            const seedB = (b.id * monthSeed) % ageAppropriateActivities.length
            return seedA - seedB
        })

    const selectedActivity = shuffledActivities[activityIndex]
    console.log("TRACE - Activity selection:", {
        weekdayCount,
        activityIndex,
        totalActivities: shuffledActivities.length,
        selectedActivity: selectedActivity ? {
            id: selectedActivity.id,
            name: selectedActivity.name,
            minAge: selectedActivity.minAge
        } : null
    })

    return selectedActivity ? [selectedActivity] : []
} 