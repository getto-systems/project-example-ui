import { docsModule, docsPurpose, docsSection } from "../z_vendor/getto-application/docs/helper"

import { DocsSection } from "../z_vendor/getto-application/docs/data"

export const docs_auth: DocsSection[] = [
    docsSection("認証・認可", [
        docsPurpose(["業務で必要な時に使用できる", "業務内容をプライベートに保つ"]),
        docsModule(["認証", "プロフィール", "ユーザー管理"]),
    ]),
]
