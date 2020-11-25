import { SeasonRepository, SeasonResponse } from "../../../infra"

import { Season } from "../../../data"

export function initMemorySeasonRepository(initialSeason: Season): SeasonRepository {
    return new MemorySeasonRepository(initialSeason)
}

class MemorySeasonRepository implements SeasonRepository {
    season: Season

    constructor(initialSeason: Season) {
        this.season = initialSeason
    }

    findSeason(): SeasonResponse {
        return { success: true, found: true, season: this.season }
    }
}
