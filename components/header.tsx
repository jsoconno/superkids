import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useKids } from "@/providers/kids-provider"
import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { FeedbackDialog } from "@/components/feedback-dialog"

// Function to get avatar URL
function getAvatarUrl(name: string, backgroundColor: string, avatarStyle: string) {
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${avatarStyle}&backgroundColor=${backgroundColor}&backgroundType=solid&radius=50&scale=90`
}

export function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const { kids } = useKids()
    const selectedKidId = typeof window !== 'undefined' ? parseInt(window.localStorage.getItem('lastSelectedKid') || '0') : 0
    const selectedKid = kids.find(kid => kid.id === selectedKidId)

    const renderNavigationButton = () => {
        if (pathname === '/kids' && kids.length > 0) {
            return (
                <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                    onClick={() => router.push('/dashboard')}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Activities
                </Button>
            )
        }

        if (pathname === '/dashboard') {
            return (
                <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                    onClick={() => router.push('/kids')}
                >
                    Manage Super Kids
                    <ArrowRight className="h-4 w-4" />
                </Button>
            )
        }

        // Default case (home page or other pages)
        return (
            <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => router.push('/kids')}
            >
                Manage Super Kids
                <ArrowRight className="h-4 w-4" />
            </Button>
        )
    }

    return (
        <header className="border-b">
            <div className="container mx-auto flex h-16 items-center px-4">
                <div className="flex items-center gap-4">
                    <h1
                        className="text-xl font-semibold cursor-pointer"
                        onClick={() => router.push('/')}
                    >
                        Super Kids
                    </h1>
                    {selectedKid && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={getAvatarUrl(selectedKid.name, selectedKid.backgroundColor, selectedKid.avatarStyle)}
                                alt={selectedKid.name}
                            />
                        </Avatar>
                    )}
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <FeedbackDialog>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2"
                        >
                            Give Feedback
                        </Button>
                    </FeedbackDialog>
                    {renderNavigationButton()}
                </div>
            </div>
        </header>
    )
} 