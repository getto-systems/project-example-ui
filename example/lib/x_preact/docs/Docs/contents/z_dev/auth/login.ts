import { h, VNode } from "preact"
import { html } from "htm/preact"

import { box, container } from "../../../../../../z_vendor/getto-css/preact/design/box"
import { v_small } from "../../../../../../z_vendor/getto-css/preact/design/alignment"

import { pending } from "../../../box"

import { DocsComponent } from "../../../../../../docs/kernel/x_preact/docs"
import {
    docs_auth_sign,
    docs_auth_sign_description,
    docs_auth_sign_explanation,
    docs_auth_sign_negativeNote,
} from "../../../../../../auth/sign/docs"

export const content_development_auth_login = (): VNode[] => [
    h(DocsComponent, {
        contents: [
            [[...docs_auth_sign, ...docs_auth_sign_explanation, ...docs_auth_sign_negativeNote]],
            ...docs_auth_sign_description,
        ],
    }),
    v_small(),
    container(webAuthn()),
]

const webAuthn = () => [
    box({
        title: pending("web 証明書認証"),
        body: html`
            <p>web 証明書の検証</p>
            <p>チケットを新規発行</p>
            <p>API トークンを発行</p>
            <p>コンテンツトークンを発行</p>
        `,
    }),
    box({
        title: pending("web 証明書登録"),
        body: html`
            <p>チケットの検証</p>
            <p>パスワードの検証</p>
            <p>新 web 証明書の登録</p>
            <small><p>以前の証明書は使用できなくなる</p></small>
        `,
    }),
]
