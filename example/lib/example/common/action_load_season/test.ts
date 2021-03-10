import {
    mockClock,
    mockClockPubSub,
} from "../../../z_vendor/getto-application/infra/clock/mock"

import { initLoadSeasonCoreAction } from "./core/impl"
import { SeasonRepositoryPod } from "../load_season/infra"
import { mockDB } from "../../../z_vendor/getto-application/infra/repository/mock"
import { wrapRepository } from "../../../z_vendor/getto-application/infra/repository/helper"
import { markSeason } from "../load_season/impl/test_helper"
import { seasonRepositoryConverter } from "../load_season/impl/convert"

describe("LoadSeason", () => {
    test("load from repository", () => {
        const { resource } = standard_elements()

        expect(resource.season.load()).toEqual({ success: true, value: { year: 2020 } })
    })

    test("not found; use default", () => {
        const { resource } = empty_elements()

        expect(resource.season.load()).toEqual({ success: true, value: { year: 2021 } })
    })

    test("save season", () => {
        const season = standard_season()

        // TODO カバレッジのために直接呼び出している。シーズンの設定用 action を作るべき
        season(seasonRepositoryConverter).set(markSeason({ year: 2021 }))
    })
})

function standard_elements() {
    const resource = newResource(standard_season())

    return { resource }
}
function empty_elements() {
    const resource = newResource(empty_season())

    return { resource }
}

function newResource(season: SeasonRepositoryPod) {
    const clock = mockClock(new Date("2021-01-01 10:00:00"), mockClockPubSub())
    return {
        season: initLoadSeasonCoreAction({
            season,
            clock,
        }),
    }
}

function standard_season(): SeasonRepositoryPod {
    const season = mockDB()
    season.set({ year: 2020 })
    return wrapRepository(season)
}
function empty_season(): SeasonRepositoryPod {
    return wrapRepository(mockDB())
}
