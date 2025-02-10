"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export const AVATAR_COLORS = [
    { value: "ff3b30", label: "Red" },
    { value: "ff9500", label: "Orange" },
    { value: "ffcc00", label: "Yellow" },
    { value: "4cd964", label: "Green" },
    { value: "5ac8fa", label: "Light Blue" },
    { value: "007aff", label: "Blue" },
    { value: "5856d6", label: "Purple" },
    { value: "ff2d55", label: "Pink" },
    { value: "8b4513", label: "Brown" },
    { value: "34495e", label: "Navy" }
]

interface ColorPickerProps {
    value: string
    onChange: (value: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
    return (
        <div className="p-2">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {AVATAR_COLORS.map((color) => (
                    <div key={color.value} className="aspect-square">
                        <button
                            className={cn(
                                "w-full h-full rounded-full flex items-center justify-center transition-all",
                                "ring-2 ring-offset-2",
                                value === color.value
                                    ? "ring-primary"
                                    : "ring-transparent hover:ring-primary/50"
                            )}
                            style={{ backgroundColor: `#${color.value}` }}
                            onClick={() => onChange(color.value)}
                            type="button"
                            title={color.label}
                        >
                            {value === color.value && (
                                <Check className="h-4 w-4 text-white" />
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
} 