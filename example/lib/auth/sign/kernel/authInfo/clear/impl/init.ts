import { newAuthzRepository } from "../../../../../../common/authz/infra/repository/authz"
import { newLastAuthRepository } from "../../kernel/infra/repository/lastAuth"

import { ClearAuthInfoInfra } from "../infra"

export function newClearAuthInfoInfra(webStorage: Storage): ClearAuthInfoInfra {
    return {
        lastAuth: newLastAuthRepository(webStorage),
        authz: newAuthzRepository(webStorage),
    }
}
