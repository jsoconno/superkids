import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Kid } from "@/types/kids"
import { startOfWeek, endOfWeek, eachDayOfInterval, format, addWeeks, subWeeks, getWeek } from "date-fns"

interface ProgressChartProps {
    kid: Kid
}

interface ChartData {
    week: string
    activities: number
    weekNumber: number
}

export function ProgressChart({ kid }: ProgressChartProps) {
    // Get the last 8 weeks of data
    const today = new Date()
    const startDate = subWeeks(today, 7)

    // Generate weekly data
    const data: ChartData[] = []
    let currentWeekStart = startOfWeek(startDate)

    for (let i = 0; i < 8; i++) {
        const weekEnd = endOfWeek(currentWeekStart)
        const weekNumber = getWeek(currentWeekStart)
        const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: weekEnd })

        // Count activities for each day in the week
        let weeklyActivities = 0
        daysInWeek.forEach(day => {
            const dateKey = format(day, "yyyy-MM-dd")
            if (kid.completedActivities[dateKey]) {
                weeklyActivities += kid.completedActivities[dateKey].length
            }
        })

        data.push({
            week: `Week ${weekNumber}`,
            activities: weeklyActivities,
            weekNumber: weekNumber
        })

        currentWeekStart = addWeeks(currentWeekStart, 1)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Progress</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="week"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="activities"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ fill: "hsl(var(--primary))" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
} 