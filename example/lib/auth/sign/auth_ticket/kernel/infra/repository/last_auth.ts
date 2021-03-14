import { env } from "../../../../../../y_environment/env"

import { newDB_Authn } from "../../../../../../z_external/db/auth/authn"

import { wrapRepository } from "../../../../../../z_vendor/getto-application/infra/repository/helper"

import { AuthnRepositoryPod } from "../../infra"

export function newAuthnRepository(storage: Storage): AuthnRepositoryPod {
    return wrapRepository(newDB_Authn(storage, env.storageKey.authn))
}
