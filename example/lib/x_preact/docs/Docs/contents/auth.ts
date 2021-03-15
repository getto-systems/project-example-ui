import { h, VNode } from "preact"
import { html } from "htm/preact"

import { itemsSection } from "../box"

import { box } from "../../../../z_vendor/getto-css/preact/design/box"
import { notice_info } from "../../../../z_vendor/getto-css/preact/design/highlight"

import { DocsContentComponent } from "../../../../docs/action_docs/x_preact/content"

import { docs_auth, docs_auth_summary, docs_auth_detail } from "../../../../auth/docs"

export const content_auth = (): VNode[] => [
    h(DocsContentComponent, {
        contents: [[[...docs_auth, ...docs_auth_summary]], ...docs_auth_detail],
    }),
]

export function content_auth_login(): VNode {
    return box({
        title: "ログイン",
        body: [
            notice_info("業務で必要な時に使用できる"),
            notice_info("業務内容をプライベートに保つ"),
            html`
                <p>認証トークンの更新</p>
                <p>パスワードログイン</p>
                <p>web 証明書ログイン</p>
            `,
        ],
    })
}
export function content_auth_permission(): VNode {
    return box({
        title: "アクセス制限",
        body: [
            notice_info("業務で必要な時に使用できる"),
            notice_info("業務内容をプライベートに保つ"),
            html`
                <p>メニューの表示可否</p>
                <p>API へのアクセス可否</p>
            `,
        ],
    })
}
export function content_auth_user(): VNode {
    return box({
        title: "ユーザー管理",
        body: [
            notice_info("業務で必要な時に使用できる"),
            notice_info("業務内容をプライベートに保つ"),
            itemsSection("管理ユーザーでユーザー情報を変更", [
                "ユーザーの登録",
                "ユーザーの無効化",
                "ユーザーの削除",
                "ログインID 変更",
                "パスワード変更",
                "web 証明書変更",
                "アクセス制限変更",
            ]),
        ],
    })
}
export function content_auth_profile(): VNode {
    return box({
        title: "認証情報管理",
        body: [
            notice_info("業務で必要な時に使用できる"),
            notice_info("業務内容をプライベートに保つ"),
            html`
                <p>自分のパスワードを変更</p>
                <p>パスワードリセット</p>
                <p>新しい web 証明書を登録</p>
                <p>ログアウト</p>
            `,
        ],
    })
}
