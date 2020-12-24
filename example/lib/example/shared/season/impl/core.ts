import { SeasonInfra, YearRepository } from "../infra"

import { LoadSeasonPod } from "../action"

import { Season, markSeason } from "../data"

export const loadSeason = (infra: SeasonInfra): LoadSeasonPod => () => (post) => {
    const { seasons, years } = infra

    const response = seasons.findSeason()
    if (!response.success) {
        post({ type: "failed-to-load", err: response.err })
        return
    }

    if (!response.found) {
        post({ type: "succeed-to-load", season: defaultSeason(years) })
        return
    }

    post({ type: "succeed-to-load", season: response.season })
}
function defaultSeason(years: YearRepository): Season {
    return markSeason({ year: years.currentYear() })
}
