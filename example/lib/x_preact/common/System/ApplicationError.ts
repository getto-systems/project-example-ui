import { VNode } from "preact"
import { html } from "htm/preact"

import { fullScreenError, v_medium } from "../layout"

type Props = Readonly<{
    err: string
}>

export function ApplicationError({ err }: Props): VNode {
    return fullScreenError(
        html`アプリケーション実行中にエラーが発生しました`,
        html`
            <p>エラーが発生したため、アプリケーションは動作を停止しました</p>
            <p>(詳細: ${err})</p>
            ${v_medium()}
            <p>お手数ですが、管理者にご連絡お願いします</p>
        `,
        html``
    )
}
