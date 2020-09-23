import { VNode } from "preact"
import { html } from "htm/preact"

import { ErrorView } from "./layout"

export function ApplicationError(): VNode {
    return ErrorView(
        html`アプリケーション実行中にエラーが発生しました`,
        html`
            <p>エラーが発生したため、アプリケーションは動作を停止しました</p>
            <div class="vertical vertical_medium"></div>
            <p>お手数ですが、管理者にご連絡お願いします</p>
        `,
        html``,
    )
}
