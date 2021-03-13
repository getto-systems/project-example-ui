import { h, VNode } from "preact"
import { html } from "htm/preact"

import { itemsSection } from "../box"

import { box } from "../../../../z_vendor/getto-css/preact/design/box"
import { notice_info } from "../../../../z_vendor/getto-css/preact/design/highlight"

import { DocsComponent } from "../../../../docs/kernel/x_preact/docs"

import { docs_auth_sign } from "../../../../auth/sign/docs"
import { docs_auth } from "../../../../auth/docs"
import { docs_auth_sign_checkAuthInfo } from "../../../../auth/sign/kernel/auth_info/action_check/docs"
import { docs_auth_sign_logout } from "../../../../auth/sign/kernel/auth_info/action_logout/docs"
import { docs_auth_sign_authenticatePassword } from "../../../../auth/sign/password/view_authenticate/docs"
import { docs_auth_sign_resetPassword } from "../../../../auth/sign/password/reset/docs"
import { docsModule, docsSection_pending } from "../../../../z_vendor/getto-application/docs/helper"

import { DocsSection } from "../../../../z_vendor/getto-application/docs/data"

export const content_auth = (): VNode[] => [
    h(DocsComponent, {
        contents: [
            [...docs_auth, ...docs_auth_sign, ...docs_auth_profile, ...docs_auth_user],
            [
                ...docs_auth_sign_checkAuthInfo,
                ...docs_auth_sign_logout,
                ...docs_auth_sign_authenticatePassword,
                ...docs_auth_sign_resetPassword,

                ...docs_auth_sign_authenticateWebAuthn,
            ],
        ],
    }),
]

const docs_auth_sign_authenticateWebAuthn: DocsSection[] = [
    docsSection_pending("web 証明書ログイン", [
        docsModule(["web 証明書で認証", "認証成功でトークンを発行"]),
    ]),
]

const docs_auth_profile: DocsSection[] = [
    docsSection_pending("認証情報管理", [
        docsModule(["パスワード変更", "パスワードリセット", "web 証明書再登録"]),
    ]),
]
const docs_auth_user: DocsSection[] = [
    docsSection_pending("ユーザー管理", [
        docsModule([
            "ユーザーの登録",
            "ユーザーの無効化",
            "ユーザーの削除",
            "ログインID 変更",
            "アクセス権限変更",
            "パスワード変更",
            "web 証明書変更",
        ]),
    ]),
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
