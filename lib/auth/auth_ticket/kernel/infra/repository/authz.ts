import { env } from "../../../../../y_environment/env"
import { newDB_Authz } from "../../../../../z_external/db/auth/authz"

import { convertRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"

import { AuthzRepositoryPod } from "../../infra"

export function newAuthzRepository(webDB: IDBFactory): AuthzRepositoryPod {
    return convertRepository(newDB_Authz(webDB, { database: env.database.authz }))
}
