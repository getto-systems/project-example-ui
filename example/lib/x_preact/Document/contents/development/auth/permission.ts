import { VNode } from "preact"
import { html } from "htm/preact"

import { itemsSection } from "../../../box"

import { content_auth_permission } from "../../auth"
import { box, container } from "../../../../../z_external/getto-css/preact/design/box"
import { v_medium } from "../../../../../z_external/getto-css/preact/design/alignment"

export const content_development_auth_permission = (): VNode[] => [
    container([
        content_auth_permission(),
        box({
            title: "業務で必要な時に使用するために",
            body: [html`<p>role によるメニューの表示可否</p>`],
        }),
        box({
            title: "業務内容をプライベートに保つために",
            body: [html`<p>role による API のアクセス制限</p>`],
        }),
    ]),
    v_medium(),
    container(role()),
]

const role = () => [
    box({
        title: "role によるメニューの表示可否",
        body: [
            html`<p>特定の role を持っていないと表示できないメニュー項目を設定可能</p>`,
            itemsSection("role", ["認証時に認証トークンと一緒に取得", "ユーザーごとに必要な権限を設定"]),
        ],
    }),
    box({
        title: "role による API のアクセス制限",
        body: [html`<p>特定の role を持っていないとアクセスできない API を設定可能</p>`],
    }),
]
