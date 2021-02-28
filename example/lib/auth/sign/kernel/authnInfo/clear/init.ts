import { newAuthzRepository } from "../../../../../common/authz/infra/repository/authz"
import { newAuthnInfoRepository } from "../kernel/infra/repository/authnInfo/init"

import { ClearInfra } from "./infra"

export function newClearInfra(webStorage: Storage): ClearInfra {
    return {
        authz: newAuthzRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
    }
}
