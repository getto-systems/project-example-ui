import { env } from "../../../../../y_environment/env"

import { newDB_Season } from "../../../../../z_external/db/example/season"

import { convertRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"

import { SeasonRepositoryPod } from "../../infra"

export function newSeasonRepositoryPod(webDB: IDBFactory): SeasonRepositoryPod {
    return convertRepository(newDB_Season(webDB, env.storageKey.season))
}
