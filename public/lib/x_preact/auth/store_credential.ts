import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { StoreCredentialComponent, initialStoreCredentialComponentState } from "../../auth/store_credential/data"

import { AuthCredential } from "../../credential/data"

export interface PreactComponent {
    (): VNode
}

export function StoreCredential(component: StoreCredentialComponent, authCredential: AuthCredential): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialStoreCredentialComponentState)
        useEffect(() => {
            component.init(setState)
            component.store(authCredential)
            return () => component.terminate()
        }, [])

        switch (state.type) {
            case "initial-store":
            case "succeed-to-store":
                return html``

            case "failed-to-store":
                // TODO エラー画面を用意
                return html`ERROR: ${state.err}`
        }
    }
}
