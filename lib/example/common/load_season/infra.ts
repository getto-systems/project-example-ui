import { Clock } from "../../../z_vendor/getto-application/infra/clock/infra"
import {
    FetchRepositoryResult,
    RepositoryConverter,
    StoreRepositoryResult,
} from "../../../z_vendor/getto-application/infra/repository/infra"

import { Season } from "./data"

export type LoadSeasonInfra = Readonly<{
    season: SeasonRepositoryPod
    clock: Clock
}>

export interface SeasonRepositoryPod {
    (converter: RepositoryConverter<Season, SeasonRepositoryValue>): SeasonRepository
}
export interface SeasonRepository {
    get(): Promise<FetchRepositoryResult<Season>>
    set(value: Season): Promise<StoreRepositoryResult>
    remove(): Promise<StoreRepositoryResult>
}

export type SeasonRepositoryValue = Readonly<{
    year: number
}>
