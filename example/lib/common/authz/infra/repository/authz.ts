import { env } from "../../../../y_environment/env"
import { newDB_Authz } from "../../../../z_external/db/authz"

import { wrapRepository } from "../../../../z_vendor/getto-application/infra/repository/helper"

import { AuthzRepository } from "../../infra"

export function newAuthzRepository(storage: Storage): AuthzRepository {
    return wrapRepository(newDB_Authz(storage, env.storageKey.authz))
}
