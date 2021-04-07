import { newClock } from "../../../../z_vendor/getto-application/infra/clock/init"
import { newSeasonRepositoryPod } from "../infra/repository/season"

import { LoadSeasonInfra } from "../infra"

export function newLoadSeasonInfra(webDB: IDBFactory): LoadSeasonInfra {
    return {
        season: newSeasonRepositoryPod(webDB),
        clock: newClock(),
    }
}
