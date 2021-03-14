import { newAuthzRepository } from "../../kernel/infra/repository/authz"
import { newAuthnRepository } from "../../kernel/infra/repository/last_auth"

import { ClearAuthInfoInfra } from "../infra"

export function newClearAuthInfoInfra(webStorage: Storage): ClearAuthInfoInfra {
    return {
        authn: newAuthnRepository(webStorage),
        authz: newAuthzRepository(webStorage),
    }
}
