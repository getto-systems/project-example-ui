import { env } from "../../../../../y_environment/env"

import { newDB_Season } from "../../../../../z_details/db/example/season"

import { convertRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"

import { RepositoryOutsideFeature } from "../../../../../z_vendor/getto-application/infra/repository/infra"
import { SeasonRepositoryPod } from "../../infra"

export function newSeasonRepositoryPod(feature: RepositoryOutsideFeature): SeasonRepositoryPod {
    return convertRepository(newDB_Season(feature, { database: env.database.season }))
}
