import { docsModule, docsSection } from "../../../../../z_vendor/getto-application/docs/helper"

import { DocsSection } from "../../../../../z_vendor/getto-application/docs/data"

export const docs_auth_sign_checkAuthInfo: DocsSection[] = [
    docsSection("アクセスチケット更新", [
        docsModule([
            "画面表示の際にチケットを更新",
            "その後、定期的に継続更新",
            "有効期限切れでログイン画面に遷移",
        ]),
    ]),
]
