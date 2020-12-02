import { VNode } from "preact"
import { html } from "htm/preact"

import { container, v_small, v_medium, notice_warning } from "../../../layout"
import { box, items } from "../box"

export const content_index = (): VNode[] => [
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

const details = (): VNode[] => [detail_document(), detail_deployment(), detail_auth(), detail_update()]

export function detail_document(): VNode {
    return box(
        "ドキュメント",
        html`
            ${notice_warning("業務の目標を達成する")} ${v_medium()}
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
    )
}
export function detail_deployment(): VNode {
    return box(
        "配備構成",
        html`
            ${notice_warning("業務で必要な時に使用できる")}
            ${notice_warning("業務に合ったコストで運用できる")} ${v_medium()}
            <p>業務時間内は常にアクセス可能</p>
            <p>コストがかかりすぎない構成</p>
        `
    )
}
export function detail_auth(): VNode {
    return box(
        "認証・認可",
        html`
            ${notice_warning("業務で必要な時に使用できる")}
            ${notice_warning("業務内容をプライベートに保つ")} ${v_medium()}
            <p>適切なアクセス制限</p>
            <p>適切なユーザー管理</p>
        `
    )
}
export function detail_update(): VNode {
    return box(
        "最新版の使用",
        html`
            ${notice_warning("業務で必要な時に使用できる")} ${v_medium()}
            <p>新しいバージョンの配備を検知</p>
            <p>自動的に最新版を使用する</p>
        `
    )
}
