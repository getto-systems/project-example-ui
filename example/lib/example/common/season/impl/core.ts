import { SeasonInfra } from "../infra"

import { LoadSeasonPod } from "../action"

import { defaultSeason } from "../data"

export const loadSeason = (infra: SeasonInfra): LoadSeasonPod => () => (post) => {
    const { seasons, clock } = infra

    const response = seasons.findSeason()
    if (!response.success) {
        post({ type: "failed-to-load", err: response.err })
        return
    }

    if (!response.found) {
        post({ type: "succeed-to-load", season: defaultSeason(clock.now()) })
        return
    }

    post({ type: "succeed-to-load", season: response.season })
}
