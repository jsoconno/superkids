import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Bug, Lightbulb, MessageSquarePlus } from "lucide-react"

interface FeedbackDialogProps {
    className?: string
    children?: React.ReactNode
}

export function FeedbackDialog({ className, children }: FeedbackDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [type, setType] = useState<"bug" | "feature">("bug")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const response = await fetch("https://api.github.com/repos/jsoconno/superkids/issues", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: `[${type.toUpperCase()}] ${title}`,
                    body: description,
                    labels: [type, "user-request"],
                }),
            })

            if (response.ok) {
                // Clear form and close dialog
                setTitle("")
                setDescription("")
                setType("bug")
                setIsOpen(false)
            } else {
                console.error("Failed to create issue:", await response.text())
            }
        } catch (error) {
            console.error("Error creating issue:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button
                        variant="outline"
                        size="sm"
                        className={className}
                    >
                        <MessageSquarePlus className="w-4 h-4 mr-2" />
                        Feedback
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit Feedback</DialogTitle>
                    <DialogDescription>
                        Help us improve Super Kids by reporting bugs or suggesting new features.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                            value={type}
                            onValueChange={(value: "bug" | "feature") => setType(value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bug">
                                    <div className="flex items-center">
                                        <Bug className="w-4 h-4 mr-2" />
                                        Report a Bug
                                    </div>
                                </SelectItem>
                                <SelectItem value="feature">
                                    <div className="flex items-center">
                                        <Lightbulb className="w-4 h-4 mr-2" />
                                        Suggest a Feature
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={type === "bug"
                                ? "Brief description of the issue..."
                                : "Name your feature suggestion..."
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            placeholder={type === "bug"
                                ? "Please describe what happened and how to reproduce it..."
                                : "Please describe your feature idea in detail..."
                            }
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!title.trim() || !description.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 