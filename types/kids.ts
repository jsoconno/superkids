export type HeroType = "super_boy" | "super_girl"

export interface Kid {
    id: number
    name: string
    birthday: Date
    hero_type: HeroType
    backgroundColor: string
    completedActivities: {
        [date: string]: number[]
    }
} 