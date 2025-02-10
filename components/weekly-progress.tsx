import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, getDay, isSameWeek } from "date-fns"
import { Kid } from "@/types/kids"

interface WeeklyProgressProps {
    kid: Kid
    selectedDate: Date
}

export function WeeklyProgress({ kid, selectedDate }: WeeklyProgressProps) {
    const weekStart = startOfWeek(selectedDate)
    const weekEnd = endOfWeek(selectedDate)
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const isCurrentWeek = isSameWeek(selectedDate, new Date())

    // Get activities completed for each day this week
    const weeklyProgress = daysInWeek.map(day => {
        const dateKey = format(day, "yyyy-MM-dd")
        const dayOfWeek = getDay(day)
        const isWeekday = dayOfWeek > 0 && dayOfWeek < 6
        const activitiesCompleted = isWeekday ? (kid.completedActivities[dateKey]?.length || 0) : 0
        return {
            date: day,
            completed: activitiesCompleted,
            isToday: isSameDay(day, new Date()),
            isWeekday
        }
    })

    // Calculate total progress for the weekdays only
    const totalCompleted = weeklyProgress.reduce((sum, day) => sum + day.completed, 0)
    const totalPossible = weeklyProgress.filter(day => day.isWeekday).length // 5 weekdays
    const progressPercentage = (totalCompleted / totalPossible) * 100

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isCurrentWeek ? "This Week's Progress" : "Selected Week's Progress"}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Progress value={progressPercentage} />
                        <p className="text-sm text-muted-foreground text-center">
                            {totalCompleted} of {totalPossible} activities completed this week
                        </p>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {weeklyProgress.map((day, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center"
                            >
                                <span className="text-xs text-muted-foreground">
                                    {format(day.date, "EEE")}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${!day.isWeekday
                                    ? "bg-muted text-muted-foreground"
                                    : day.isToday
                                        ? "bg-primary text-primary-foreground"
                                        : day.completed > 0
                                            ? "bg-secondary"
                                            : "bg-muted"
                                    }`}>
                                    {day.isWeekday ? day.completed : '-'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 