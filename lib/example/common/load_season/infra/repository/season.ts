import { env } from "../../../../../y_environment/env"

import { newDB_Season } from "../../../../../z_external/db/example/season"

import { convertRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"

import { SeasonRepositoryPod } from "../../infra"

export function newSeasonRepositoryPod(webStorage: Storage): SeasonRepositoryPod {
    return convertRepository(newDB_Season(webStorage, env.storageKey.season))
}
