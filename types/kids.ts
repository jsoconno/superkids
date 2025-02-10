export type HeroType = "super_boy" | "super_girl"

export type AvatarStyle = "brooklynn" | "valentina" | "emery" | "jocelyn" | "jessica" | "robert" |
    "christopher" | "oliver" | "eden" | "jude" | "maria" | "leo" | "jade" | "avery" |
    "easton" | "liam" | "ryker" | "mackenzie" | "mason" | "sophia"

export interface Kid {
    id: number
    name: string
    birthday: Date
    hero_type: HeroType
    backgroundColor: string
    avatarStyle: AvatarStyle
    completedActivities: {
        [date: string]: number[]
    }
} 