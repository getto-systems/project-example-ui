import { h, VNode } from "preact"
import { html } from "htm/preact"

import { box, container } from "../../../../z_vendor/getto-css/preact/design/box"
import { notice_info } from "../../../../z_vendor/getto-css/preact/design/highlight"
import { v_medium } from "../../../../z_vendor/getto-css/preact/design/alignment"

import { items } from "../box"

import { DocsComponent } from "../../../../docs/kernel/x_preact/docs"

import { docs_docs } from "../../../../docs/docs"
import { docs_example } from "../../../../example/docs"
import { docs_avail } from "../../../../avail/docs"
import { docs_auth } from "../../../../auth/docs"

export const content_index = (): VNode[] => [
    h(DocsComponent, { contents: [docs_example, [...docs_docs, ...docs_auth, ...docs_avail]] }),
    container([
        content_index_document(),
        content_index_available(),
        content_index_auth(),
        content_index_deployment(),
    ]),
]

export function content_index_document(): VNode {
    return box({
        title: "ドキュメント",
        body: [
            notice_info("業務の目標を達成する"),
            html` <p>重要な点を明文化する</p> `,
            v_medium(),
            items([
                "重要な点が推測できる",
                "重要でない点が推測できる",
                "すべての関係者が読める",
                "書きやすい",
            ]),
        ],
    })
}
export function content_index_available(): VNode {
    return box({
        title: "保守・運用",
        body: [
            notice_info("業務の目標を達成する"),
            notice_info("業務で必要な時に使用できる"),
            html`
                <p>常に最新版を使用</p>
                <p>エラーを収集</p>
            `,
        ],
    })
}
export function content_index_auth(): VNode {
    return box({
        title: "認証・認可",
        body: [
            notice_info("業務で必要な時に使用できる"),
            notice_info("業務内容をプライベートに保つ"),
            html`
                <p>適切なログイン</p>
                <p>適切なアクセス制限</p>
                <p>適切なユーザー管理</p>
                <p>適切な認証情報管理</p>
            `,
        ],
    })
}
export function content_index_deployment(): VNode {
    return box({
        title: "配備構成",
        body: [
            notice_info("業務で必要な時に使用できる"),
            notice_info("業務に合ったコストで運用できる"),
            html`
                <p>業務時間内は常にアクセス可能</p>
                <p>コストがかかりすぎない構成</p>
            `,
        ],
    })
}
