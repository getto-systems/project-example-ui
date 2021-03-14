import { env } from "../../../../../../y_environment/env"
import { newDB_Authz } from "../../../../../../z_external/db/auth/authz"

import { wrapRepository } from "../../../../../../z_vendor/getto-application/infra/repository/helper"

import { AuthzRepositoryPod } from "../../infra"

export function newAuthzRepository(storage: Storage): AuthzRepositoryPod {
    return wrapRepository(newDB_Authz(storage, env.storageKey.authz))
}
