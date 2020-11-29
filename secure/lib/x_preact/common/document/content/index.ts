import { VNode } from "preact"
import { html } from "htm/preact"

import { v_small, v_medium } from "../../../layout"
import { container, box, items, notice_info } from "../box"

export function content_index(): VNode[] {
    return [
        container([
            box(
                "GETTO Example",
                html`
                    <p>業務アプリケーションのひな型</p>
                    <p>このコードをコピーして始める</p>
                `
            ),
            box(
                "業務アプリケーション",
                html`
                    ${items([
                        "業務の目標を達成できる",
                        "業務で必要な時に使用できる",
                        "業務に合ったコストで運用できる",
                        "業務の内容をプライベートに保つ",
                    ])}
                `
            ),
        ]),
        v_small(),
        container(details()),
    ]
}
function details(): VNode[] {
    return [
        box(
            "ドキュメント",
            html`
                ${notice_info("業務の目標を達成する")} ${v_medium()}
                <p>重要な点を明文化する</p>
                <p>重要な指標を見える化する</p>
                ${v_medium()}
                ${items([
                    "重要な点が推測できる",
                    "重要でない点が推測できる",
                    "可能な限り多くの関係者が読める",
                    "書きやすい",
                ])}
            `
        ),
        box(
            "アプリケーションの配備",
            html`
                ${notice_info("業務で必要な時に使用できる")}
                ${notice_info("業務に合ったコストで運用できる")} ${v_medium()}
                <p>業務時間内は常にアクセス可能</p>
                <p>コストがかかりすぎない構成</p>
            `
        ),
        box(
            "認証・認可",
            html`
                ${notice_info("業務で必要な時に使用できる")}
                ${notice_info("業務の内容をプライベートに保つ")} ${v_medium()}
                <p>適切なアクセス制限</p>
                <p>適切なユーザー管理</p>
            `
        ),
    ]
}
