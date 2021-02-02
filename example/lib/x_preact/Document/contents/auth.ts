import { VNode } from "preact"
import { html } from "htm/preact"

import { itemsSection } from "../box"

import { content_index_auth } from "./home"
import { box, container } from "../../../z_external/getto-css/preact/design/box"
import { notice_info } from "../../../z_external/getto-css/preact/design/highlight"
import { v_medium } from "../../../z_external/getto-css/preact/design/alignment"

export const content_auth = (): VNode[] => [
    container(content_index_auth()),
    container([
        content_auth_login(),
        content_auth_permission(),
        content_auth_user(),
        content_auth_profile(),
    ]),
]
export function content_auth_login(): VNode {
    return box({
        title: "ログイン",
        body: [
            notice_info("業務で必要な時に使用できる"),
            notice_info("業務内容をプライベートに保つ"),
            v_medium(),
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
            v_medium(),
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
            v_medium(),
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
            v_medium(),
            html`
                <p>自分のパスワードを変更</p>
                <p>パスワードリセット</p>
                <p>新しい web 証明書を登録</p>
                <p>ログアウト</p>
            `,
        ],
    })
}
