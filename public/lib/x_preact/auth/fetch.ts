import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    FetchComponent,
    initialFetchComponentState,
} from "../../auth/fetch/data"

export interface PreactComponent {
    (): VNode
}

export function Fetch(component: FetchComponent): PreactComponent {
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
                // TODO renew に遷移
                return html`fetched: ${state.ticketNonce.ticketNonce}`
        }
    }
}
