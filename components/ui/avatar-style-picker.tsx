import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { AvatarStyle } from "@/types/kids"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export const AVATAR_STYLES: { value: AvatarStyle; label: string }[] = [
    { value: "brooklynn", label: "Brooklynn" },
    { value: "valentina", label: "Valentina" },
    { value: "emery", label: "Emery" },
    { value: "jocelyn", label: "Jocelyn" },
    { value: "jessica", label: "Jessica" },
    { value: "robert", label: "Robert" },
    { value: "christopher", label: "Christopher" },
    { value: "oliver", label: "Oliver" },
    { value: "eden", label: "Eden" },
    { value: "jude", label: "Jude" },
    { value: "maria", label: "Maria" },
    { value: "leo", label: "Leo" },
    { value: "jade", label: "Jade" },
    { value: "avery", label: "Avery" },
    { value: "easton", label: "Easton" },
    { value: "liam", label: "Liam" },
    { value: "ryker", label: "Ryker" },
    { value: "mackenzie", label: "Mackenzie" },
    { value: "mason", label: "Mason" },
    { value: "sophia", label: "Sophia" }
]

interface AvatarStylePickerProps {
    value: AvatarStyle
    onChange: (value: AvatarStyle) => void
    backgroundColor: string
}

export function AvatarStylePicker({ value, onChange, backgroundColor }: AvatarStylePickerProps) {
    const getAvatarUrl = (style: AvatarStyle) => {
        // Always use white background for the modal preview
        return `https://api.dicebear.com/7.x/lorelei/svg?seed=${style}&backgroundColor=ffffff&backgroundType=solid&radius=50&scale=90`
    }

    return (
        <div className="p-2">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {AVATAR_STYLES.map((style) => (
                    <div key={style.value} className="aspect-square">
                        <button
                            className={cn(
                                "relative w-full h-full rounded-full transition-all",
                                "ring-2 ring-offset-2",
                                value === style.value
                                    ? "ring-primary"
                                    : "ring-transparent hover:ring-primary/50"
                            )}
                            onClick={() => onChange(style.value)}
                            type="button"
                            title={style.label}
                        >
                            <Avatar className="h-full w-full">
                                <AvatarImage
                                    src={getAvatarUrl(style.value)}
                                    alt={style.label}
                                />
                                <AvatarFallback>{style.label.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            {value === style.value && (
                                <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Check className="h-4 w-4 text-primary" />
                                </div>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
} 