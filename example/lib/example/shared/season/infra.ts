import { Season, SeasonError } from "./data"

export type SeasonInfra = Readonly<{
    seasons: SeasonRepository
    clock: Clock
}>

export interface SeasonRepository {
    findSeason(): SeasonResponse
}
export interface Clock {
    now(): Date
}

export type SeasonResponse =
    | Readonly<{ success: false; err: SeasonError }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: true; found: true; season: Season }>
