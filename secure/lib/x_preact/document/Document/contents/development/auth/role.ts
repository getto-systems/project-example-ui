import { VNode } from "preact"
import { html } from "htm/preact"

import { container, v_medium } from "../../../../../layout"
import { box, itemsSection } from "../../../box"

import { content_auth_role } from "../../auth"

export const content_development_auth_role = (): VNode[] => [
    container([
        content_auth_role(),
        box("業務で必要な時に使用するために", [html`<p>role によるメニューの表示可否</p>`]),
        box("業務内容をプライベートに保つために", [html`<p>role による API のアクセス制限</p>`]),
    ]),
    v_medium(),
    container(role()),
]

const role = () => [
    box("role によるメニューの表示可否", [
        html`<p>特定の role を持っていないと表示できないメニュー項目を設定可能</p>`,
        itemsSection("role", ["認証時に認証トークンと一緒に取得", "ユーザーごとに必要な権限を設定"]),
    ]),
    box("role による API のアクセス制限", [
        html`<p>特定の role を持っていないとアクセスできない API を設定可能</p>`,
    ]),
]
