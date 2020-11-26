import { LoadSeasonEvent } from "./data"

export interface LoadSeason {
    (): LoadSeasonAction
}
export interface LoadSeasonAction {
    (post: Post<LoadSeasonEvent>): void
}

interface Post<T> {
    (event: T): void
}