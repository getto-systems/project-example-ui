import { newAuthzRepository } from "../../kernel/infra/repository/authz"
import { newAuthnRepository } from "../../kernel/infra/repository/last_auth"

import { ClearAuthTicketInfra } from "../infra"

export function newClearAuthTicketInfra(webStorage: Storage): ClearAuthTicketInfra {
    return {
        authn: newAuthnRepository(webStorage),
        authz: newAuthzRepository(webStorage),
    }
}
