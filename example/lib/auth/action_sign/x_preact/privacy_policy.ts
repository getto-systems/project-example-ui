import { VNode } from "preact"
import { html } from "htm/preact"

import { loginBox } from "../../../z_vendor/getto-css/preact/layout/login"
import { buttons, field } from "../../../z_vendor/getto-css/preact/design/form"

import { siteInfo } from "../../../x_preact/common/site"
import { signNav } from "../../sign/common/nav/x_preact/nav"

import { SignLinkResource } from "../../sign/common/nav/action_nav/resource"

export function PrivacyPolicyComponent(props: SignLinkResource): VNode {
    return loginBox(siteInfo(), {
        title: "プライバシーポリシー",
        body: [
            field({
                title: "ログインID / パスワード",
                body: html`
                    システムを使用するための認証に使用します<br />
                    それ以外の用途で使用することはありません<br />
                    パスワードは暗号化して送信、保存されます
                `,
            }),
            field({
                title: "メールアドレス",
                body: html`
                    パスワードリセットのために使用します<br />
                    それ以外の用途で使用することはありません
                `,
            }),
            field({
                title: "業務データ",
                body: html`
                    システムで扱うすべてのデータは、業務を行うために使用します<br />
                    業務に関係ない対象に情報が開示されることはありません
                `,
            }),
        ],
        footer: buttons({ left: loginLink(), right: resetLink() }),
    })

    function loginLink(): VNode {
        return signNav(props.link.getNav_password_authenticate())
    }
    function resetLink() {
        return signNav(props.link.getNav_password_reset_requestToken())
    }
}
