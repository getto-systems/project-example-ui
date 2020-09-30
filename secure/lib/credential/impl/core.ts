import { Infra } from "../infra"

import {
    CredentialAction,
} from "../action"

import { FetchResponse } from "../data"

export function initCredentialAction(infra: Infra): CredentialAction {
    return new Action(infra)
}

class Action implements CredentialAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra
    }

    fetch(): FetchResponse {
        return this.infra.apiCredentials.findApiCredential()
    }
}
