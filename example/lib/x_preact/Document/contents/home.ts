import { VNode } from "preact"
import { html } from "htm/preact"

import { box, container } from "../../../z_external/getto-css/preact/design/box"
import { notice_info } from "../../../z_external/getto-css/preact/design/highlight"
import { v_medium, v_small } from "../../../z_external/getto-css/preact/design/alignment"

import { items } from "../box"

export const content_index = (): VNode[] => [
    container([
        box({
            title: "GETTO Example",
            body: html`
                <p>業務アプリケーションのひな型</p>
                <p>このコードをコピーして始める</p>
            `,
        }),
        box({
            title: "業務アプリケーション",
            body: [
                notice_info("業務の目標を達成する"),
                notice_info("業務で必要な時に使用できる"),
                notice_info("業務に合ったコストで運用できる"),
                notice_info("業務内容をプライベートに保つ"),
            ],
        }),
    ]),
    v_small(),
    container([
        content_index_document(),
        content_index_deployment(),
        content_index_auth(),
        content_index_update(),
    ]),
]
export function content_index_document(): VNode {
    return box({
        title: "ドキュメント",
        body: [
            notice_info("業務の目標を達成する"),
            v_medium(),
            html`
                <p>重要な点を明文化する</p>
                <p>重要な指標を見える化する</p>
            `,
            v_medium(),
            items([
                "重要な点が推測できる",
                "重要でない点が推測できる",
                "可能な限り多くの関係者が読める",
                "書きやすい",
            ]),
        ],
    })
}
export function content_index_deployment(): VNode {
    return box({
        title: "配備構成",
        body: [
            notice_info("業務で必要な時に使用できる"),
            notice_info("業務に合ったコストで運用できる"),
            v_medium(),
            html`
                <p>業務時間内は常にアクセス可能</p>
                <p>コストがかかりすぎない構成</p>
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
            v_medium(),
            html`
                <p>適切なログイン</p>
                <p>適切なアクセス制限</p>
                <p>適切なユーザー管理</p>
                <p>適切な認証情報管理</p>
            `,
        ],
    })
}
export function content_index_update(): VNode {
    return box({
        title: "最新版の使用",
        body: [
            notice_info("業務で必要な時に使用できる"),
            v_medium(),
            html`
                <p>新しいバージョンの配備を検知</p>
                <p>自動的に最新版を使用する</p>
            `,
        ],
    })
}
