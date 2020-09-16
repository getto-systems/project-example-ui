import { Infra } from "../infra"

import { CredentialAction, CredentialEventHandler, StoreEventPublisher } from "../action"

import { AuthCredential } from "../data"

export function initCredentialAction(handler: CredentialEventHandler, infra: Infra): CredentialAction {
    return new Action(handler, infra)
}

class Action implements CredentialAction {
    handler: CredentialEventHandler
    infra: Infra

    constructor(handler: CredentialEventHandler, infra: Infra) {
        this.handler = handler
        this.infra = infra
    }

    async fetch(): Promise<void> {
        const found = this.infra.authCredentials.findTicketNonce()
        if (!found.success) {
            this.handler.handleFetchEvent({ type: "failed-to-fetch", err: found.err })
            return
        }
        if (!found.found) {
            this.handler.handleFetchEvent({ type: "require-login" })
            return
        }
        this.handler.handleFetchEvent({ type: "succeed-to-fetch", ticketNonce: found.ticketNonce })
    }
    async store(authCredential: AuthCredential): Promise<void> {
        const response = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!response.success) {
            this.handler.handleStoreEvent({ type: "failed-to-store", err: response.err })
            return
        }
        this.handler.handleStoreEvent({ type: "succeed-to-store" })
    }

    async storeDeprecated(event: StoreEventPublisher, authCredential: AuthCredential): Promise<void> {
        const response = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!response.success) {
            event.failedToStore(response.err)
            return
        }

        event.succeedToStore()
    }
}
