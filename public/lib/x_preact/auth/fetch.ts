import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    FetchComponent,
    initialFetchComponentState,
} from "../../auth/fetch/data"

import { TicketNonce } from "../../credential/data"

export interface PreactComponent {
    (): VNode
}

export interface Next {
    (ticketNonce: TicketNonce): void
}

export function Fetch(component: FetchComponent, next: Next): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialFetchComponentState)
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

            case "succeed-to-fetch":
                next(state.ticketNonce)
                return html``
        }
    }
}
