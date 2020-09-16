import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    StoreComponent,
    initialStoreComponentState,
} from "../../auth/store/data"

import { AuthCredential } from "../../credential/data"

export interface PreactComponent {
    (): VNode
}

export interface Next {
    (): void
}

export function Store(component: StoreComponent, authCredential: AuthCredential, next: Next): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialStoreComponentState)
        useEffect(() => {
            component.init(setState)
            component.store(authCredential)
            return () => component.terminate()
        }, [])

        switch (state.type) {
            case "initial-store":
                return html``

            case "failed-to-store":
                // TODO エラー画面を用意
                return html`ERROR: ${state.err}`

            case "succeed-to-store":
                next()
                return html``
        }
    }
}
