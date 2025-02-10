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
import { Gender } from "@/types/kids"

interface ManageKidsModalProps {
  isOpen: boolean
  onClose: () => void
  onAddKid: (name: string, birthday: Date, gender: Gender) => void
}

export function ManageKidsModal({ isOpen, onClose, onAddKid }: ManageKidsModalProps) {
  const [newKidName, setNewKidName] = useState("")
  const [newKidBirthday, setNewKidBirthday] = useState<Date | undefined>(undefined)
  const [newKidGender, setNewKidGender] = useState<Gender>("male")
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
    if (newKidName.trim() && newKidBirthday && newKidGender) {
      onAddKid(newKidName.trim(), newKidBirthday, newKidGender)
      setNewKidName("")
      setNewKidBirthday(undefined)
      setNewKidGender("male")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={newKidGender}
                onValueChange={(value: Gender) => setNewKidGender(value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
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
                footer={newKidBirthday && (
                  <p className="text-sm text-muted-foreground text-center">
                    Selected: {format(newKidBirthday, "PPP")}
                  </p>
                )}
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

