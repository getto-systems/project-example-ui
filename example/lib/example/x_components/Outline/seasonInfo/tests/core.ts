import { initSeasonInfoComponent } from "../impl"

import { Clock } from "../../../../../z_getto/infra/clock/infra"
import { SeasonRepository } from "../../../../shared/season/infra"

import { SeasonInfoComponent } from "../component"

import { initTestSeasonAction } from "../../../../shared/season/tests/season"

export type SeasonInfoRepository = Readonly<{
    seasons: SeasonRepository
}>
export function newTestSeasonInfoComponent(
    repository: SeasonInfoRepository,
    clock: Clock
): SeasonInfoComponent {
    const action = initTestSeasonAction(repository.seasons, clock)

    return initSeasonInfoComponent({
        loadSeason: action.loadSeason(),
    })
}
