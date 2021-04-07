import { env } from "../../../../../y_environment/env"
import { newDB_Authz } from "../../../../../z_details/db/auth/authz"

import { convertRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"

import { RepositoryOutsideFeature } from "../../../../../z_vendor/getto-application/infra/repository/infra"
import { AuthzRepositoryPod } from "../../infra"

export function newAuthzRepositoryPod(feature: RepositoryOutsideFeature): AuthzRepositoryPod {
    return convertRepository(newDB_Authz(feature, { database: env.database.authz }))
}
