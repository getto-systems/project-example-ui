import { Season, SeasonError } from "./data"

export type SeasonInfra = Readonly<{
    seasons: SeasonRepository
    years: YearRepository
}>

export interface SeasonRepository {
    findSeason(): SeasonResponse
}
export interface YearRepository {
    currentYear(): number
}

export type SeasonResponse =
    | Readonly<{ success: false; err: SeasonError }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: true; found: true; season: Season }>
