import { newClock } from "../../../../z_vendor/getto-application/infra/clock/init"
import { newSeasonRepositoryPod } from "../infra/repository/season"

import { LoadSeasonInfra } from "../infra"
import { RepositoryOutsideFeature } from "../../../../z_vendor/getto-application/infra/repository/infra"

type OutsideFeature = RepositoryOutsideFeature
export function newLoadSeasonInfra(feature: OutsideFeature): LoadSeasonInfra {
    return {
        season: newSeasonRepositoryPod(feature),
        clock: newClock(),
    }
}
