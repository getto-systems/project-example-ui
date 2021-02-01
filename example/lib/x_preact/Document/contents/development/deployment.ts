import { VNode } from "preact"
import { html } from "htm/preact"

import { content_index_deployment } from "../home"
import { box, container } from "../../../../z_external/getto-css/preact/design/box"
import { v_medium, v_small } from "../../../../z_external/getto-css/preact/design/alignment"
import { field } from "../../../../z_external/getto-css/preact/design/form"

export const content_development_deployment = (): VNode[] => [
    container([
        content_index_deployment(),
        box({
            title: "業務で必要な時に使用するために",
            body: [
                html`
                    <p>必要な時に使用可能</p>
                    <p>使用中に操作が中断されない</p>
                `,
                v_medium(),
                field({
                    title: "停止許容時間",
                    body: html`<p>5分/10h</p>`,
                    help: ["業務時間内", "業務時間外の停止は連絡後に可能"],
                }),
                field({
                    title: "レスポンスの最大待ち時間",
                    body: html`<p>1秒</p>`,
                    help: ["処理自体に時間がかかる場合は完了時に通知を行う"],
                }),
            ],
        }),
        box({
            title: "業務に合ったコストで運用するために",
            body: [field({ title: "ランニングコスト", body: html`<p>6,000円/月</p>` })],
        }),
    ]),
    v_small(),
    container([applicationServer(), databaseServer()]),
]

const applicationServer = () =>
    box({
        title: "アプリケーションサーバー",
        body: [
            field({
                title: "サービス",
                body: html`<p>Google Cloud Run</p>`,
                help: [
                    "アップグレードコストが抑えられる",
                    "特に OS のアップグレードが簡単",
                    "デプロイコストが抑えられる",
                    "ランニングコストが抑えられる",
                ],
            }),
            field({ title: "よくない点", body: html`<p>運用開始してないのでわからない</p>` }),
            field({
                title: "制約",
                body: html`<p>ステートレスなアプリケーションを構築する必要がある</p>`,
            }),
            field({
                title: "代替案",
                body: html`
                    <p>K8s クラスタ</p>
                    <p>普通のサーバーインスタンス</p>
                    <p>Lambda とか Functions</p>
                `,
            }),
        ],
    })

const databaseServer = () =>
    box({
        title: "データベースサーバー",
        body: [
            field({
                title: "サービス",
                body: html`<p>Google SQL</p>`,
                help: [
                    "冗長構成で構築",
                    "引き継ぐシステムがリレーショナルデータベースを使用したものであるため SQL サービスを採用",
                ],
            }),
            field({ title: "よくない点", body: html`<p>コストがかかる</p>` }),
            field({
                title: "代替案",
                body: html`
                    <p>Key-Value ストア</p>
                    <p>グラフデータベース</p>
                `,
                help: ["実装に適切ならこれらを使用する"],
            }),
        ],
    })
