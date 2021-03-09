import { newClock } from "../../../z_vendor/getto-application/infra/clock/init"

import { initMockLoadSeasonCoreAction } from "./core/mock"

import { defaultSeason } from "../load_season/impl/convert"

import { LoadSeasonResource } from "./resource"

export function standard_MockLoadSeasonResource(): LoadSeasonResource {
    const clock = newClock()
    return {
        season: initMockLoadSeasonCoreAction({ success: true, value: defaultSeason(clock) }),
    }
}
