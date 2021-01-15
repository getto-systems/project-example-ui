import { VNode } from "preact"
import { html } from "htm/preact"

import { container, v_medium, v_small } from "../../../common/layout"
import { box, form, formWithHelp } from "../../box"

import { content_index_deployment } from "../home"

export const content_development_deployment = (): VNode[] => [
    container([
        content_index_deployment(),
        box("業務で必要な時に使用するために", [
            html`
                <p>必要な時に使用可能</p>
                <p>使用中に操作が中断されない</p>
            `,
            v_medium(),
            formWithHelp("停止許容時間", html`<p>5分/10h</p>`, [
                "業務時間内",
                "業務時間外の停止は連絡後に可能",
            ]),
            formWithHelp("レスポンスの最大待ち時間", html`<p>1秒</p>`, [
                "処理自体に時間がかかる場合は完了時に通知を行う",
            ]),
        ]),
        box("業務に合ったコストで運用するために", [
            formWithHelp("ランニングコスト", html`<p>6,000円/月</p>`, []),
        ]),
    ]),
    v_small(),
    container([applicationServer(), databaseServer()]),
]

function applicationServer(): VNode {
    return box("アプリケーションサーバー", [
        formWithHelp("サービス", html`<p>Google Cloud Run</p>`, [
            "アップグレードコストが抑えられる",
            "特に OS のアップグレードが簡単",
            "デプロイコストが抑えられる",
            "ランニングコストが抑えられる",
        ]),
        form("よくない点", html`<p>運用開始してないのでわからない</p>`),
        form("制約", html`<p>ステートレスなアプリケーションを構築する必要がある</p>`),
        form(
            "代替案",
            html`
                <p>K8s クラスタ</p>
                <p>普通のサーバーインスタンス</p>
                <p>Lambda とか Functions</p>
            `
        ),
    ])
}
function databaseServer(): VNode {
    return box("データベースサーバー", [
        formWithHelp("サービス", html`<p>Google SQL</p>`, [
            "冗長構成で構築",
            "引き継ぐシステムがリレーショナルデータベースを使用したものであるため SQL サービスを採用",
        ]),
        form("よくない点", html`<p>コストがかかる</p>`),
        formWithHelp(
            "代替案",
            html`
                <p>Key-Value ストア</p>
                <p>グラフデータベース</p>
            `,
            ["実装に適切ならこれらを使用する"]
        ),
    ])
}
