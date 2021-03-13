import { docsModule, docsSection } from "../../../../../z_vendor/getto-application/docs/helper"

import { DocsSection } from "../../../../../z_vendor/getto-application/docs/data"

export const docs_auth_sign_logout: DocsSection[] = [
    docsSection("ログアウト", [
        docsModule(["保持しているアクセストークンを破棄", "アクセストークンの無効化"]),
    ]),
]
