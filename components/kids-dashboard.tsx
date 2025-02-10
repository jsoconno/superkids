import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Pencil } from "lucide-react"
import { format, startOfWeek, getWeek, differenceInYears } from "date-fns"
import { Kid, Gender } from "@/types/kids"
import { EditKidModal } from "@/components/edit-kid-modal"
import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Function to get initials from name
function getInitials(name: string) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

// Function to get avatar URL
function getAvatarUrl(name: string) {
    const seed = name.toLowerCase().replace(/\s+/g, '-')
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`
}

interface KidsDashboardProps {
    kids: Kid[]
    onDeleteKid: (kidId: number) => void
    onAddKid: () => void
    onSelectKid: (kidId: number) => void
    onUpdateKid: (id: number, name: string, birthday: Date, gender: Gender) => void
    selectedKid: number | null
    selectedDate: Date
}

export function KidsDashboard({
    kids,
    onDeleteKid,
    onAddKid,
    onSelectKid,
    onUpdateKid,
    selectedKid,
    selectedDate
}: KidsDashboardProps) {
    const [editingKid, setEditingKid] = useState<Kid | null>(null)

    const getTotalActivitiesCompleted = (kid: Kid) => {
        return Object.values(kid.completedActivities).flat().length
    }

    const getAge = (birthday: Date) => {
        return differenceInYears(new Date(), birthday)
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {kids.map((kid) => {
                    const isSelected = kid.id === selectedKid
                    return (
                        <Card
                            key={kid.id}
                            className={cn(
                                "cursor-pointer flex flex-col relative transition-all duration-200",
                                isSelected && "ring-2 ring-primary border-primary shadow-lg",
                                !isSelected && "hover:border-primary/50 hover:shadow-sm"
                            )}
                            onClick={() => onSelectKid(kid.id)}
                        >
                            {isSelected && (
                                <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm">
                                    Selected Super Kid
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src={getAvatarUrl(kid.name)}
                                            alt={kid.name}
                                        />
                                        <AvatarFallback>{getInitials(kid.name)}</AvatarFallback>
                                    </Avatar>
                                    <CardTitle className={cn(
                                        isSelected && "text-primary"
                                    )}>
                                        {kid.name} (Age: {getAge(kid.birthday)})
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground">
                                    Total activities completed: {getTotalActivitiesCompleted(kid)}
                                </p>
                            </CardContent>
                            <CardFooter className="justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setEditingKid(kid)
                                    }}
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDeleteKid(kid.id)
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
            <EditKidModal
                isOpen={editingKid !== null}
                onClose={() => setEditingKid(null)}
                onUpdateKid={onUpdateKid}
                kid={editingKid}
            />
        </>
    )
} 