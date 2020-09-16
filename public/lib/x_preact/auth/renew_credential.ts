import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { RenewCredentialComponent, initialRenewCredentialComponentState } from "../../auth/renew_credential/data"

import { TicketNonce } from "../../credential/data"

export interface PreactComponent {
    (): VNode
}

export function RenewCredential(component: RenewCredentialComponent, ticketNonce: TicketNonce): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialRenewCredentialComponentState)
        useEffect(() => {
            component.init(setState)
            component.trigger({ type: "renew", ticketNonce })
            return () => component.terminate()
        }, [])

        switch (state.type) {
            case "initial-renew":
            case "unauthorized":
            case "succeed-to-renew":
                return html``

            case "try-to-renew":
                // すぐに帰ってくる想定
                return html``

            case "delayed-to-renew":
                // TODO 遅くなっている画面を用意
                // 30秒のカウンターをつけたいね
                return html`
                    <p>
                        認証に時間がかかっています。<br/>
                        30秒以上かかるようなら何かがおかしいので、お手数ですが管理者に連絡をお願いします。
                    </p>
                `

            case "failed-to-renew":
                // TODO エラー画面を用意
                return html`ERROR: ${state.err}`
        }
    }
}
