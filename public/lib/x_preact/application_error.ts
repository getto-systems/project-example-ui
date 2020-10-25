import { VNode } from "preact"
import { html } from "htm/preact"

import { loginError } from "./layout"

type Props = {
    err: string
}

export function ApplicationError(props: Props): VNode {
    return loginError(
        html`アプリケーション実行中にエラーが発生しました`,
        html`
            <p>エラーが発生したため、アプリケーションは動作を停止しました</p>
            <p>(詳細: ${props.err})</p>
            <div class="vertical vertical_medium"></div>
            <p>お手数ですが、管理者にご連絡お願いします</p>
        `,
        html``
    )
}
