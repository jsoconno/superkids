import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Pencil, Cake } from "lucide-react"
import { format, startOfWeek, getWeek, differenceInYears, differenceInMonths } from "date-fns"
import { Kid, HeroType, AvatarStyle } from "@/types/kids"
import { ManageKidsModal } from "@/components/manage-kids-modal"
import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import React from "react"

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
function getAvatarUrl(name: string, backgroundColor: string, avatarStyle: string) {
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${avatarStyle}&backgroundColor=${backgroundColor}&backgroundType=solid&radius=50&scale=90`
}

// Function to get age display
function getAgeDisplay(birthday: Date) {
    const years = differenceInYears(new Date(), birthday)
    return `${years} year${years !== 1 ? 's' : ''} old`
}

interface KidsDashboardProps {
    kids: Kid[]
    onDeleteKid: (kidId: number) => void
    onAddKid: () => void
    onSelectKid: (kidId: number) => void
    onUpdateKid: (name: string, birthday: Date, hero_type: HeroType, backgroundColor: string, avatarStyle: AvatarStyle) => void
    selectedKid: number | null
    selectedDate: Date
    onEditKid: (kidId: number) => void
}

export function KidsDashboard({
    kids,
    onDeleteKid,
    onAddKid,
    onSelectKid,
    onUpdateKid,
    selectedKid,
    selectedDate,
    onEditKid
}: KidsDashboardProps) {
    const [editingKid, setEditingKid] = useState<Kid | null>(null)
    const [deletingKid, setDeletingKid] = useState<Kid | null>(null)
    const [openPopoverId, setOpenPopoverId] = useState<number | null>(null)
    const popoverTimerRef = React.useRef<NodeJS.Timeout>()

    const handleMouseEnter = (kidId: number) => {
        popoverTimerRef.current = setTimeout(() => {
            setOpenPopoverId(kidId)
        }, 1000)
    }

    const handleMouseLeave = () => {
        if (popoverTimerRef.current) {
            clearTimeout(popoverTimerRef.current)
        }
        setOpenPopoverId(null)
    }

    const getTotalActivitiesCompleted = (kid: Kid) => {
        return Object.values(kid.completedActivities).flat().length
    }

    const getAge = (birthday: Date) => {
        return differenceInYears(new Date(), birthday)
    }

    const handleDelete = (kid: Kid) => {
        setDeletingKid(kid)
    }

    const confirmDelete = () => {
        if (deletingKid) {
            onDeleteKid(deletingKid.id)
            setDeletingKid(null)
        }
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
                                            src={getAvatarUrl(kid.name, kid.backgroundColor, kid.avatarStyle)}
                                            alt={kid.name}
                                            onError={(e) => {
                                                console.error('Avatar image error:', e)
                                                const target = e.target as HTMLImageElement
                                                console.log('Failed URL:', target.src)
                                            }}
                                        />
                                        <AvatarFallback>{getInitials(kid.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-1">
                                            <CardTitle className={cn(
                                                "text-lg",
                                                isSelected && "text-primary"
                                            )}>
                                                {kid.name}
                                            </CardTitle>
                                            <div className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                                {getAgeDisplay(kid.birthday)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Popover open={openPopoverId === kid.id}>
                                                <PopoverTrigger asChild>
                                                    <span
                                                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                                        onMouseEnter={() => handleMouseEnter(kid.id)}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        {getTotalActivitiesCompleted(kid)} activities completed
                                                    </span>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-2"
                                                    onMouseEnter={() => setOpenPopoverId(kid.id)}
                                                    onMouseLeave={handleMouseLeave}
                                                >
                                                    <p className="text-sm">Total activities completed</p>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter className="justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onEditKid(kid.id)
                                    }}
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(kid)
                                    }}
                                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            <ManageKidsModal
                isOpen={editingKid !== null}
                onClose={() => setEditingKid(null)}
                onSave={(name, birthday, hero_type, backgroundColor, avatarStyle) => {
                    if (editingKid) {
                        onUpdateKid(name, birthday, hero_type, backgroundColor, avatarStyle)
                    }
                    setEditingKid(null)
                }}
                kid={editingKid || undefined}
            />

            <Dialog open={deletingKid !== null} onOpenChange={() => setDeletingKid(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Super Kid</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove {deletingKid?.name} from your team? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingKid(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Remove Super Kid
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
} 