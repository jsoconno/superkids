"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { format, getYear, getDaysInMonth } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HeroType, AvatarStyle, Kid } from "@/types/kids"
import { ColorPicker, AVATAR_COLORS } from "@/components/ui/color-picker"
import { AvatarStylePicker, AVATAR_STYLES } from "@/components/ui/avatar-style-picker"

interface ManageKidsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, birthday: Date, hero_type: HeroType, backgroundColor: string, avatarStyle: AvatarStyle) => void
  kid?: Kid // Optional kid for edit mode
}

export function ManageKidsModal({ isOpen, onClose, onSave, kid }: ManageKidsModalProps) {
  const [name, setName] = useState("")
  const [heroType, setHeroType] = useState<HeroType>("super_boy")
  const [color, setColor] = useState(AVATAR_COLORS[0].value)
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>(AVATAR_STYLES[0].value)

  // Birthday state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState(1)
  const [daysInMonth, setDaysInMonth] = useState<number[]>([])

  const years = Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => 1990 + i)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Initialize form with kid data when editing
  useEffect(() => {
    if (kid) {
      setName(kid.name)
      setHeroType(kid.hero_type)
      setColor(kid.backgroundColor)
      setAvatarStyle(kid.avatarStyle)

      const birthday = new Date(kid.birthday)
      setSelectedMonth(birthday.getMonth())
      setSelectedYear(birthday.getFullYear())
      setSelectedDay(birthday.getDate())
    } else {
      // Reset form for new kid
      setName("")
      setHeroType("super_boy")
      setColor(AVATAR_COLORS[0].value)
      setAvatarStyle(AVATAR_STYLES[0].value)

      const now = new Date()
      setSelectedMonth(now.getMonth())
      setSelectedYear(now.getFullYear())
      setSelectedDay(1)
    }
  }, [kid])

  // Update days when month/year changes
  useEffect(() => {
    const date = new Date(selectedYear, selectedMonth, 1)
    const daysCount = getDaysInMonth(date)
    setDaysInMonth(Array.from({ length: daysCount }, (_, i) => i + 1))
    // Adjust selected day if it exceeds the days in the new month
    if (selectedDay > daysCount) {
      setSelectedDay(daysCount)
    }
  }, [selectedMonth, selectedYear, selectedDay])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      const birthday = new Date(selectedYear, selectedMonth, selectedDay)
      onSave(name.trim(), birthday, heroType, color, avatarStyle)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{kid ? 'Edit' : 'Add'} Super Kid</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="kid-form" className="flex-1 overflow-y-auto">
          <div className="grid gap-6 py-4 px-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter kid's name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hero_type">Hero Type</Label>
                <Select
                  value={heroType}
                  onValueChange={(value: HeroType) => setHeroType(value)}
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
            </div>

            <div className="grid gap-2">
              <Label>Birthday</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedDay.toString()}
                  onValueChange={(value) => setSelectedDay(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysInMonth.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
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
            </div>

            <div className="grid gap-2">
              <Label>Avatar Style</Label>
              <AvatarStylePicker
                value={avatarStyle}
                onChange={setAvatarStyle}
                backgroundColor={color}
              />
            </div>

            <div className="grid gap-2">
              <Label>Avatar Color</Label>
              <ColorPicker value={color} onChange={setColor} />
            </div>
          </div>
        </form>
        <DialogFooter className="flex-shrink-0">
          <Button
            type="submit"
            form="kid-form"
            className="w-full"
            disabled={!name.trim()}
          >
            {kid ? 'Update' : 'Add'} Super Kid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

