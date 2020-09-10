import { VNode } from "preact"
import { useState } from "preact/hooks"
import { html } from "htm/preact"

import { RenewComponent } from "../../auth/renew"

export interface PreactComponent {
    (): VNode
}

export function Renew(component: RenewComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(component.initialState())
        component.onStateChange(setState)

        switch (state.type) {
            case "initial-renew":
                component.renew()
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

            case "failed-to-store":
                // TODO エラー画面を用意
                return html`ERROR: ${state.err}`
        }
    }
}
