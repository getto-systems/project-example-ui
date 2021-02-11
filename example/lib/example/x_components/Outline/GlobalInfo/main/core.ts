import { loadSeason } from "../../../../shared/season/impl/core"

import { initDateClock } from "../../../../../z_infra/clock/date"
import { initMemorySeasonRepository } from "../../../../shared/season/impl/repository/season/memory"

import { SeasonAction } from "../../../../shared/season/action"

import { markSeason } from "../../../../shared/season/data"

export function initSeasonAction(): SeasonAction {
    return {
        loadSeason: loadSeason({
            seasons: initMemorySeasonRepository({
                stored: true,
                season: markSeason({ year: new Date().getFullYear() }),
            }),
            clock: initDateClock(),
        }),
    }
}
