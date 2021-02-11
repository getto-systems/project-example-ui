import { loadApiNonce, loadApiRoles } from "../impl/core"

import { ApiCredentialRepository } from "../infra"

import { CredentialAction } from "../action"

export function initTestCredentialAction(apiCredentials: ApiCredentialRepository): CredentialAction {
    const infra = {
        apiCredentials,
    }

    return {
        loadApiNonce: loadApiNonce(infra),
        loadApiRoles: loadApiRoles(infra),
    }
}
