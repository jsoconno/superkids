import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format, getWeek, parseISO } from "date-fns"
import { Kid } from "@/types/kids"

interface WeeklyCalendarProps {
    selectedDate: Date
    onSelectDate: (date: Date | undefined) => void
    selectedKid: Kid | null
}

export function WeeklyCalendar({ selectedDate, onSelectDate, selectedKid }: WeeklyCalendarProps) {
    const weekNumber = getWeek(selectedDate)

    const getDaysWithActivities = (kid: Kid): Date[] => {
        return Object.keys(kid.completedActivities)
            .filter((date) => kid.completedActivities[date].length > 0)
            .map((dateStr) => parseISO(dateStr))
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Week {weekNumber}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex-calendar">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={onSelectDate}
                        showOutsideDays={false}
                        className="w-full"
                        classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                            month: "space-y-4 w-full",
                            table: "w-full border-collapse",
                            head_row: "flex w-full",
                            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "text-center text-sm relative p-0 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 h-9 w-full",
                            day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-muted rounded-md",
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50",
                            day_hidden: "invisible",
                            nav: "flex items-center justify-between space-x-1 p-1",
                            nav_button: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0",
                            nav_button_previous: "static",
                            nav_button_next: "static",
                            caption: "flex justify-center pt-1 relative items-center px-8 mb-4",
                            caption_label: "flex items-center gap-2 text-sm font-medium",
                        }}
                        modifiers={{
                            completed: selectedKid ? getDaysWithActivities(selectedKid) : [],
                        }}
                        modifiersClassNames={{
                            completed: "day-with-activities"
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    )
} 