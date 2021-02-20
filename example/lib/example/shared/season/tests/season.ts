import { Clock } from "../../../../z_getto/infra/clock/infra"

import { loadSeason } from "../impl/core"

import { SeasonRepository } from "../infra"

import { SeasonAction } from "../action"

export function initTestSeasonAction(seasons: SeasonRepository, clock: Clock): SeasonAction {
    const infra = {
        seasons,
        clock,
    }

    return {
        loadSeason: loadSeason(infra),
    }
}
