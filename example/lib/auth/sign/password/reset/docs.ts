import { docsModule, docsSection } from "../../../../z_vendor/getto-application/docs/helper"

import { DocsSection } from "../../../../z_vendor/getto-application/docs/data"

export const docs_auth_sign_resetPassword: DocsSection[] = [
    docsSection("パスワードリセット", [
        docsModule([
            "ログインIDでリセットトークンを発行",
            "ログインIDに紐づいた宛先に送信",
            "リセットトークン送信状況のチェック",
            "送信されたリセットトークンでパスワードリセット",
            "リセットしたら認証チケットを発行",
        ]),
    ]),
]
