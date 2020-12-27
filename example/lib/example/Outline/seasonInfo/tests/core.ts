import { initSeasonAction } from "../../Menu/tests/core"

import { initSeasonInfoComponent } from "../impl"

import { Clock } from "../../../../z_infra/clock/infra"
import { SeasonRepository } from "../../../shared/season/infra"

import { SeasonInfoComponent } from "../component"

export type SeasonInfoRepository = Readonly<{
    seasons: SeasonRepository
}>
export function newSeasonInfoComponent(
    repository: SeasonInfoRepository,
    clock: Clock
): SeasonInfoComponent {
    const action = initSeasonAction(repository.seasons, clock)

    return initSeasonInfoComponent({
        loadSeason: action.loadSeason(),
    })
}
