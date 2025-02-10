import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { format, getYear, setYear, setMonth } from "date-fns"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Kid, HeroType } from "@/types/kids"
import { ColorPicker, AVATAR_COLORS } from "@/components/ui/color-picker"

interface EditKidModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdateKid: (id: number, name: string, birthday: Date, hero_type: HeroType, backgroundColor: string) => void
    kid: Kid | null
}

export function EditKidModal({ isOpen, onClose, onUpdateKid, kid }: EditKidModalProps) {
    const [kidName, setKidName] = useState("")
    const [kidBirthday, setKidBirthday] = useState<Date | undefined>(undefined)
    const [kidHeroType, setKidHeroType] = useState<HeroType>("super_boy")
    const [kidColor, setKidColor] = useState(AVATAR_COLORS[0].value)
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

    const years = Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => 1990 + i)
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    // Update form when kid changes
    useEffect(() => {
        if (kid) {
            setKidName(kid.name)
            setKidBirthday(kid.birthday)
            setKidHeroType(kid.hero_type)
            setKidColor(kid.backgroundColor)
            setCurrentMonth(kid.birthday)
        }
    }, [kid])

    const handleYearChange = (year: string) => {
        setCurrentMonth(setYear(currentMonth, parseInt(year)))
    }

    const handleMonthChange = (monthName: string) => {
        const newDate = setMonth(currentMonth, months.indexOf(monthName))
        setCurrentMonth(newDate)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (kid && kidName.trim() && kidBirthday && kidHeroType) {
            onUpdateKid(
                kid.id,
                kidName.trim(),
                kidBirthday,
                kidHeroType,
                kidColor
            )
            onClose()
        }
    }

    if (!kid) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Edit Super Kid</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter kid's name"
                                value={kidName}
                                onChange={(e) => setKidName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="hero_type">Hero Type</Label>
                            <Select
                                value={kidHeroType}
                                onValueChange={(value: HeroType) => setKidHeroType(value)}
                            >
                                <SelectTrigger id="hero_type">
                                    <SelectValue placeholder="Select hero type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="super_boy">Super Boy</SelectItem>
                                    <SelectItem value="super_girl">Super Girl</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Avatar Color</Label>
                            <ColorPicker value={kidColor} onChange={setKidColor} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Birthday</Label>
                            <div className="flex gap-2 mb-2">
                                <Select
                                    value={months[currentMonth.getMonth()]}
                                    onValueChange={handleMonthChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((month) => (
                                            <SelectItem key={month} value={month}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={getYear(currentMonth).toString()}
                                    onValueChange={handleYearChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Calendar
                                mode="single"
                                selected={kidBirthday}
                                onSelect={setKidBirthday}
                                month={currentMonth}
                                onMonthChange={setCurrentMonth}
                                disabled={(date) => date > new Date()}
                                initialFocus
                                footer={kidBirthday && (
                                    <p className="text-sm text-muted-foreground text-center">
                                        Selected: {format(kidBirthday, "PPP")}
                                    </p>
                                )}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full" disabled={!kidName.trim() || !kidBirthday}>
                            Update Super Kid
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 