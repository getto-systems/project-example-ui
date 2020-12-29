import { loadSeason } from "../../../shared/season/impl/core"

import { initSeasonInfoComponent } from "../impl"

import { Clock } from "../../../../z_infra/clock/infra"
import { SeasonRepository } from "../../../shared/season/infra"

import { SeasonInfoComponent } from "../component"

import { SeasonAction } from "../../../shared/season/action"

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

export function initSeasonAction(seasons: SeasonRepository, clock: Clock): SeasonAction {
    const infra = {
        seasons,
        clock,
    }

    return {
        loadSeason: loadSeason(infra),
    }
}
