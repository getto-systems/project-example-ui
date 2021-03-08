import { Clock } from "../../../z_vendor/getto-application/infra/clock/infra"

import { Season, SeasonError } from "./data"

export type SeasonInfra = Readonly<{
    seasons: SeasonRepository
    clock: Clock
}>

export interface SeasonRepository {
    findSeason(): SeasonResponse
}

export type SeasonResponse =
    | Readonly<{ success: false; err: SeasonError }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: true; found: true; season: Season }>
