import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useKids } from "@/providers/kids-provider"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"

// Function to get avatar URL
function getAvatarUrl(name: string, backgroundColor: string, avatarStyle: string) {
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${avatarStyle}&backgroundColor=${backgroundColor}&backgroundType=solid&radius=50&scale=90`
}

export function Header() {
    const router = useRouter()
    const { kids } = useKids()
    const selectedKidId = typeof window !== 'undefined' ? parseInt(window.localStorage.getItem('lastSelectedKid') || '0') : 0
    const selectedKid = kids.find(kid => kid.id === selectedKidId)

    return (
        <header className="border-b">
            <div className="container mx-auto flex h-16 items-center px-4">
                <div className="flex items-center gap-2">
                    {selectedKid && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={getAvatarUrl(selectedKid.name, selectedKid.backgroundColor, selectedKid.avatarStyle)}
                                alt={selectedKid.name}
                            />
                        </Avatar>
                    )}
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        onClick={() => router.push('/kids')}
                    >
                        <Users className="h-4 w-4" />
                        Manage Super Kids
                    </Button>
                </div>
            </div>
        </header>
    )
} 