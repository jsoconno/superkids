export type Gender = 'male' | 'female'

export interface Kid {
    id: number
    name: string
    birthday: Date
    gender: Gender
    completedActivities: Record<string, number[]>
} 