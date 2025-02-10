export interface SuperheroActivity {
    id: number
    name: string
    duration: string
    description: string
    kidInstructions: string
    parentInstructions: string
    minAge: number
    /**
     * Optional fields for expanded, more engaging activities
     */
    materials?: string[]
    tipsForSuccess?: string[]
    variationIdeas?: string[]
    hero: {
        name: string
        power: string
        heroBackstory?: string
        heroMotto?: string
    }
} 