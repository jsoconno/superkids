import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, StopCircle } from "lucide-react"
import { formatDuration } from "date-fns"

interface ActivityTimerProps {
    duration: string
    onComplete: () => void
}

export function ActivityTimer({ duration, onComplete }: ActivityTimerProps) {
    const [isRunning, setIsRunning] = useState(false)
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [totalDuration, setTotalDuration] = useState(0)

    // Parse duration string (e.g., "10 minutes" -> 600 seconds)
    useEffect(() => {
        const match = duration.match(/(\d+)\s*minutes?/)
        if (match) {
            setTotalDuration(parseInt(match[1]) * 60)
        }
    }, [duration])

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isRunning && timeElapsed < totalDuration) {
            interval = setInterval(() => {
                setTimeElapsed(prev => {
                    const next = prev + 1
                    if (next >= totalDuration) {
                        setIsRunning(false)
                    }
                    return next
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isRunning, timeElapsed, totalDuration])

    const handleStart = () => setIsRunning(true)
    const handlePause = () => setIsRunning(false)
    const handleFinish = () => {
        setIsRunning(false)
        onComplete()
    }

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = seconds % 60

        return formatDuration({
            hours: hours > 0 ? hours : undefined,
            minutes: minutes > 0 ? minutes : undefined,
            seconds: remainingSeconds
        })
    }

    const progress = (timeElapsed / totalDuration) * 100

    return (
        <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="text-sm font-medium">
                        Time Elapsed: {formatTime(timeElapsed)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Duration: {formatTime(totalDuration)}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isRunning ? (
                        <Button
                            size="sm"
                            onClick={handleStart}
                            disabled={timeElapsed >= totalDuration}
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Start
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handlePause}
                        >
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleFinish}
                        disabled={timeElapsed === 0}
                    >
                        <StopCircle className="w-4 h-4 mr-2" />
                        Finish
                    </Button>
                </div>
            </div>
            <Progress value={progress} className="h-2" />
        </Card>
    )
} 