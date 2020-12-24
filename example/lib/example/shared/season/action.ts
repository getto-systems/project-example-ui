import { LoadSeasonEvent } from "./data"

export type SeasonAction = Readonly<{
    loadSeason: LoadSeasonPod
}>

export interface LoadSeasonPod {
    (): LoadSeason
}
export interface LoadSeason {
    (post: Post<LoadSeasonEvent>): void
}

interface Post<T> {
    (event: T): void
}
