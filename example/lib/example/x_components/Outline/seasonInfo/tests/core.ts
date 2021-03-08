import { initSeasonInfoComponent } from "../impl"

import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import { SeasonRepository } from "../../../../common/season/infra"

import { SeasonInfoComponent } from "../component"

import { initTestSeasonAction } from "../../../../common/season/tests/season"

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
