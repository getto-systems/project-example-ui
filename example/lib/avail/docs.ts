import { docsModule, docsPurpose, docsSection } from "../z_vendor/getto-application/docs/helper"

import { DocsSection } from "../z_vendor/getto-application/docs/data"

export const docs_avail: DocsSection[] = [
    docsSection("保守・運用", [
        docsPurpose(["業務で必要な時に使用できる"]),
        docsModule(["最新版にアップデート", "発生したエラーを収集"]),
    ]),
    docsSection("配備構成", [
        docsPurpose(["業務で必要な時に使用できる", "業務に合ったコストで運用できる"]),
        docsModule(["業務時間内のアクセスを保証", "コストがかかりすぎない構成"]),
    ]),
]
