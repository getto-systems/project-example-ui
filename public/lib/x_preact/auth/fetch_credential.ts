import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    FetchCredentialComponent,
    initialFetchCredentialComponentState,
} from "../../auth/fetch_credential/data"

import { TicketNonce } from "../../credential/data"

export interface PreactComponent {
    (): VNode
}

export interface Next {
    tryToLogin(): void
    renewCredential(ticketNonce: TicketNonce): void
}

export function FetchCredential(component: FetchCredentialComponent, next: Next): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialFetchCredentialComponentState)
        useEffect(() => {
            component.init(setState)
            component.fetch()
            return () => component.terminate()
        }, [])

        switch (state.type) {
            case "initial-fetch":
                return html``

            case "failed-to-fetch":
                // TODO エラー画面を用意
                return html`ERROR: ${state.err}`

            case "require-login":
                next.tryToLogin()
                return html``

            case "succeed-to-fetch":
                next.renewCredential(state.ticketNonce)
                return html``
        }
    }
}
