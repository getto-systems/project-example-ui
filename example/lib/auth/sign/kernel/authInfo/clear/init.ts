import { newAuthzRepository } from "../../../../../common/authz/infra/repository/authz"
import { newLastAuthRepository } from "../kernel/infra/repository/lastAuth"

import { ClearInfra } from "./infra"

export function newClearInfra(webStorage: Storage): ClearInfra {
    return {
        lastAuth: newLastAuthRepository(webStorage),
        authz: newAuthzRepository(webStorage),
    }
}
