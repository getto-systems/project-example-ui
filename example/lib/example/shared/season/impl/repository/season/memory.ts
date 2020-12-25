import { SeasonRepository, SeasonResponse } from "../../../infra"

import { Season } from "../../../data"

export function initMemorySeasonRepository(initialSeason: StoreSeason): SeasonRepository {
    return new MemorySeasonRepository(initialSeason)
}

export type StoreSeason = Readonly<{ stored: false }> | Readonly<{ stored: true; season: Season }>

class MemorySeasonRepository implements SeasonRepository {
    season: StoreSeason

    constructor(initialSeason: StoreSeason) {
        this.season = initialSeason
    }

    findSeason(): SeasonResponse {
        if (!this.season.stored) {
            return { success: true, found: false }
        }
        return { success: true, found: true, season: this.season.season }
    }
}
