import { env } from "../../../../../../../y_environment/env"

import { newDB_LastAuth } from "../../../../../../../z_external/db/auth/lastAuth"

import { wrapRepository } from "../../../../../../../z_vendor/getto-application/infra/repository/helper"

import { LastAuthRepositoryPod } from "../../infra"

export function newLastAuthRepository(storage: Storage): LastAuthRepositoryPod {
    return wrapRepository(newDB_LastAuth(storage, env.storageKey.authn))
}
