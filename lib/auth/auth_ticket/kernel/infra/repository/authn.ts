import { env } from "../../../../../y_environment/env"

import { newDB_Authn } from "../../../../../z_details/db/auth/authn"

import { convertRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"

import { RepositoryOutsideFeature } from "../../../../../z_vendor/getto-application/infra/repository/infra"
import { AuthnRepositoryPod } from "../../infra"

export function newAuthnRepositoryPod(feature: RepositoryOutsideFeature): AuthnRepositoryPod {
    return convertRepository(newDB_Authn(feature, { database: env.database.authn }))
}
