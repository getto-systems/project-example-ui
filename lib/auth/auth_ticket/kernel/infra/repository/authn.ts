import { env } from "../../../../../y_environment/env"

import { newDB_Authn } from "../../../../../z_external/db/auth/authn"

import { convertRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"

import { AuthnRepositoryPod } from "../../infra"

export function newAuthnRepositoryPod(webDB: IDBFactory): AuthnRepositoryPod {
    return convertRepository(newDB_Authn(webDB, { database: env.database.authn }))
}
