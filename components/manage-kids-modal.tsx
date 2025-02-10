"use client"

import { useState } from "react"
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
import { HeroType, AvatarStyle } from "@/types/kids"
import { ColorPicker, AVATAR_COLORS } from "@/components/ui/color-picker"
import { AvatarStylePicker, AVATAR_STYLES } from "@/components/ui/avatar-style-picker"

interface ManageKidsModalProps {
  isOpen: boolean
  onClose: () => void
  onAddKid: (name: string, birthday: Date, hero_type: HeroType, backgroundColor: string, avatarStyle: AvatarStyle) => void
}

export function ManageKidsModal({ isOpen, onClose, onAddKid }: ManageKidsModalProps) {
  const [newKidName, setNewKidName] = useState("")
  const [newKidBirthday, setNewKidBirthday] = useState<Date | undefined>(undefined)
  const [newKidHeroType, setNewKidHeroType] = useState<HeroType>("super_boy")
  const [newKidColor, setNewKidColor] = useState(AVATAR_COLORS[0].value)
  const [newKidAvatarStyle, setNewKidAvatarStyle] = useState<AvatarStyle>(AVATAR_STYLES[0].value)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  const years = Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => 1990 + i)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handleYearChange = (year: string) => {
    setCurrentMonth(setYear(currentMonth, parseInt(year)))
  }

  const handleMonthChange = (monthName: string) => {
    const newDate = setMonth(currentMonth, months.indexOf(monthName))
    setCurrentMonth(newDate)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newKidName.trim() && newKidBirthday && newKidHeroType) {
      onAddKid(newKidName.trim(), newKidBirthday, newKidHeroType, newKidColor, newKidAvatarStyle)
      setNewKidName("")
      setNewKidBirthday(undefined)
      setNewKidHeroType("super_boy")
      setNewKidColor(AVATAR_COLORS[0].value)
      setNewKidAvatarStyle(AVATAR_STYLES[0].value)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add a New Super Kid</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter kid's name"
                value={newKidName}
                onChange={(e) => setNewKidName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero_type">Hero Type</Label>
              <Select
                value={newKidHeroType}
                onValueChange={(value: HeroType) => setNewKidHeroType(value)}
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
              <Label>Avatar Style</Label>
              <AvatarStylePicker
                value={newKidAvatarStyle}
                onChange={setNewKidAvatarStyle}
                backgroundColor={newKidColor}
              />
            </div>
            <div className="grid gap-2">
              <Label>Avatar Color</Label>
              <ColorPicker value={newKidColor} onChange={setNewKidColor} />
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
                selected={newKidBirthday}
                onSelect={setNewKidBirthday}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={!newKidName.trim() || !newKidBirthday}>
              Add Super Kid
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

