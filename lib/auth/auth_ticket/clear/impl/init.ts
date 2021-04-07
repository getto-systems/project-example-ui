import { newAuthzRepository } from "../../kernel/infra/repository/authz"
import { newAuthnRepositoryPod } from "../../kernel/infra/repository/authn"

import { ClearAuthTicketInfra } from "../infra"
import { newClearAuthTicketRemote } from "../infra/clear"

export function newClearAuthTicketInfra(
    webStorage: Storage,
    webDB: IDBFactory,
    webCrypto: Crypto,
): ClearAuthTicketInfra {
    return {
        authn: newAuthnRepositoryPod(webDB),
        authz: newAuthzRepository(webStorage),
        clear: newClearAuthTicketRemote(webCrypto),
    }
}
