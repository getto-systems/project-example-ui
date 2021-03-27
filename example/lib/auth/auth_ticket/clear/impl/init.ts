import { newAuthzRepository } from "../../kernel/infra/repository/authz"
import { newAuthnRepository } from "../../kernel/infra/repository/last_auth"

import { ClearAuthTicketInfra } from "../infra"
import { newClearAuthTicketRemote } from "../infra/clear"

export function newClearAuthTicketInfra(webStorage: Storage, webCrypto: Crypto): ClearAuthTicketInfra {
    return {
        authn: newAuthnRepository(webStorage),
        authz: newAuthzRepository(webStorage),
        clear: newClearAuthTicketRemote(webCrypto),
    }
}
