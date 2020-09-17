import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { FetchCredentialComponent } from "../../auth/fetch_credential/component"
import { initialFetchCredentialComponentState } from "../../auth/fetch_credential/data"

export interface PreactComponent {
    (): VNode
}

export function FetchCredential(component: FetchCredentialComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialFetchCredentialComponentState)
        useEffect(() => {
            component.init(setState)
            component.fetch()
            return () => component.terminate()
        }, [])

        switch (state.type) {
            case "initial-fetch":
            case "unauthorized":
            case "succeed-to-fetch":
                return html``

            case "failed-to-fetch":
                // TODO エラー画面を用意
                return html`ERROR: ${state.err}`
        }
    }
}
