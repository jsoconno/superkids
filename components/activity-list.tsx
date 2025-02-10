import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { format, isToday, isTomorrow } from "date-fns"
import { SuperheroActivity } from "@/data/superhero-activities"

interface ActivityListProps {
  activities: SuperheroActivity[]
  completedActivities: number[]
  onToggle: (activityId: number) => void
  selectedDate: Date
  kidAge: Date
}

export function ActivityList({ activities = [], completedActivities = [], onToggle, selectedDate }: ActivityListProps) {
  const getDateDisplay = (date: Date) => {
    if (isToday(date)) return "today"
    if (isTomorrow(date)) return "tomorrow"
    return format(date, "EEEE, MMMM do")
  }

  if (!Array.isArray(activities) || activities.length === 0) {
    return (
      <div className="text-center py-4">
        <h2 className="text-2xl font-semibold mb-2">No activities for {getDateDisplay(selectedDate)}</h2>
        <p>Take a break and recharge for your next super adventure!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Activities for {getDateDisplay(selectedDate)}</h2>
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Checkbox
                id={`activity-${activity.id}`}
                checked={Array.isArray(completedActivities) && completedActivities.includes(activity.id)}
                onCheckedChange={() => onToggle(activity.id)}
                className="mr-2"
              />
              <label htmlFor={`activity-${activity.id}`} className="cursor-pointer">
                {activity.name}
              </label>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium mb-1">Duration:</p>
              <p>{activity.duration}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Description:</p>
              <p>{activity.description}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Instructions for Super Kid:</p>
              <p>{activity.kidInstructions}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Parent Helper Instructions:</p>
              <p>{activity.parentInstructions}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

