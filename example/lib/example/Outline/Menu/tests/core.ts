import { loadSeason } from "../../../shared/season/impl/core"

import { Clock, SeasonRepository } from "../../../shared/season/infra"

import { SeasonAction } from "../../../shared/season/action"

export function initSeasonAction(seasons: SeasonRepository, clock: Clock): SeasonAction {
    return {
        loadSeason: loadSeason({
            seasons,
            clock,
        }),
    }
}
