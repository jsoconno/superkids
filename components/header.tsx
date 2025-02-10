import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useKids } from "@/providers/kids-provider"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Menu } from "lucide-react"
import { FeedbackDialog } from "@/components/feedback-dialog"
import { useState } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// Function to get avatar URL
function getAvatarUrl(name: string, backgroundColor: string, avatarStyle: string) {
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${avatarStyle}&backgroundColor=${backgroundColor}&backgroundType=solid&radius=50&scale=90`
}

export function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { kids } = useKids()
    const [isOpen, setIsOpen] = useState(false)

    // Get selected kid from URL params first, then localStorage
    const selectedKidId = searchParams.get('kid')
        ? parseInt(searchParams.get('kid')!)
        : typeof window !== 'undefined' && window.localStorage.getItem('lastSelectedKid')
            ? parseInt(window.localStorage.getItem('lastSelectedKid')!)
            : 0

    const selectedKid = kids.find(kid => kid.id === selectedKidId)

    const handleKidSelect = (kidId: number) => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('lastSelectedKid', kidId.toString())
        }
        router.push(`/dashboard?kid=${kidId}`)
    }

    const handleNavigation = (path: string) => {
        setIsOpen(false)
        router.push(path)
    }

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
                    {pathname === '/dashboard' && (
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                {kids.map((kid) => (
                                    <Tooltip key={kid.id}>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => handleKidSelect(kid.id)}
                                                className={cn(
                                                    "relative rounded-full transition-all hover:ring-2 hover:ring-primary/50",
                                                    kid.id === selectedKidId && "ring-2 ring-primary ring-offset-2"
                                                )}
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={getAvatarUrl(kid.name, kid.backgroundColor, kid.avatarStyle)}
                                                        alt={kid.name}
                                                    />
                                                </Avatar>
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{kid.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </TooltipProvider>
                        </div>
                    )}
                </div>
                {/* Desktop Navigation */}
                <div className="ml-auto hidden md:flex items-center gap-2">
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
                {/* Mobile Navigation */}
                <div className="ml-auto md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-4">
                                <FeedbackDialog>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Give Feedback
                                    </Button>
                                </FeedbackDialog>
                                {pathname === '/kids' && kids.length > 0 ? (
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => handleNavigation('/dashboard')}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Activities
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => handleNavigation('/kids')}
                                    >
                                        Manage Super Kids
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
} 