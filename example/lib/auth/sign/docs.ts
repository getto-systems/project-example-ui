import { docsModule, docsSection } from "../../z_vendor/getto-application/docs/helper"

import { DocsSection } from "../../z_vendor/getto-application/docs/data"

export const docs_auth_sign: DocsSection[] = [
    docsSection("アクセストークン発行", [
        docsModule([
            "アクセストークン更新",
            "ログアウト",
            "パスワードログイン",
            "パスワードリセット",
            "web 証明書ログイン",
        ]),
    ]),
]
