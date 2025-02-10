import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { format, isToday, isTomorrow } from "date-fns"
import { SuperheroActivity } from "@/types/activities"

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
            <CardTitle className="text-lg flex items-center gap-4">
              <Checkbox
                id={`activity-${activity.id}`}
                checked={Array.isArray(completedActivities) && completedActivities.includes(activity.id)}
                onCheckedChange={() => onToggle(activity.id)}
                className="mr-2"
              />
              <div className="flex-grow">
                <label htmlFor={`activity-${activity.id}`} className="cursor-pointer">
                  {activity.name}
                </label>
                <div className="text-sm text-muted-foreground mt-1">
                  with {activity.hero.name} • {activity.duration}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hero Section */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Meet Your Hero: {activity.hero.name}</h3>
              <p className="text-sm mb-2">Power: {activity.hero.power}</p>
              {activity.hero.heroBackstory && (
                <p className="text-sm mb-2">{activity.hero.heroBackstory}</p>
              )}
              {activity.hero.heroMotto && (
                <p className="text-sm italic">"{activity.hero.heroMotto}"</p>
              )}
            </div>

            {/* Activity Details */}
            <div>
              <h3 className="font-semibold mb-2">Activity Description:</h3>
              <p className="text-sm">{activity.description}</p>
            </div>

            {/* Materials Section */}
            {activity.materials && activity.materials.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Materials Needed:</h3>
                <ul className="list-disc list-inside text-sm">
                  {activity.materials.map((material: string, index: number) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructions Section */}
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold mb-2">Instructions for Super Kid:</h3>
                <p className="text-sm">{activity.kidInstructions}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Parent Helper Instructions:</h3>
                <p className="text-sm">{activity.parentInstructions}</p>
              </div>
            </div>

            {/* Tips Section */}
            {activity.tipsForSuccess && activity.tipsForSuccess.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tips for Success:</h3>
                <ul className="list-disc list-inside text-sm">
                  {activity.tipsForSuccess.map((tip: string, index: number) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variations Section */}
            {activity.variationIdeas && activity.variationIdeas.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Fun Variations to Try:</h3>
                <ul className="list-disc list-inside text-sm">
                  {activity.variationIdeas.map((variation: string, index: number) => (
                    <li key={index}>{variation}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

