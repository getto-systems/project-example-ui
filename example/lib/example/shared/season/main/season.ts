import { loadSeason } from "../impl/core"

import { newClock } from "../../../../z_infra/clock/main"
import { initMemorySeasonRepository } from "../impl/repository/season/memory"

import { SeasonAction } from "../action"

import { markSeason } from "../data"

export function initSeasonAction(): SeasonAction {
    return {
        loadSeason: loadSeason({
            seasons: initMemorySeasonRepository({
                stored: true,
                season: markSeason({ year: new Date().getFullYear() }),
            }),
            clock: newClock(),
        }),
    }
}
