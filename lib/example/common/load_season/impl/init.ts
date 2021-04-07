import { newClock } from "../../../../z_vendor/getto-application/infra/clock/init"
import { newSeasonRepositoryPod } from "../infra/repository/season"

import { LoadSeasonInfra } from "../infra"

export function newLoadSeasonInfra(webStorage: Storage): LoadSeasonInfra {
    return {
        season: newSeasonRepositoryPod(webStorage),
        clock: newClock(),
    }
}
