import { VNode } from "preact"
import { html } from "htm/preact"
import { box, v_medium } from "../../box"

export function content_detail_server(): VNode {
    return html`
        <section class="container">${applicationServer()}</section>

        ${v_medium()}

        <section class="container">${databaseServer()}</section>

        ${v_medium()}

        <section class="container">
            ${box(
                "現状の構成のよくない点",
                html` <p><i class="lnir lnir-close"></i> データベースのダウンで全体が停止</p>
                    <small><p>冗長構成にして、ダウンしないことを祈るしかない</p></small>`
            )}
        </section>
    `
}
function applicationServer() {
    return html`
        ${box(
            "google Cloud Run を使用",
            html` <p>アップグレードコストが抑えられる</p>
                <small><p>特に OS のアップグレードが簡単</p></small>
                <p>デプロイコストが抑えられる</p>
                <p>ランニングコストが抑えられる</p>`
        )}
        ${box("google Cloud Run のよくない点", html` <p>まだ運用開始してないのでわからない</p>`)}
        ${box(
            "google Cloud Run の制約",
            html` <p>ステートレスなアプリケーションを構築する必要がある</p>`
        )}
        ${box(
            "代替案",
            html` <p>K8s クラスタを使用</p>
                <p>普通のサーバーインスタンスを使用</p>
                <p>Lambda とか Functions を使用</p>`
        )}
    `
}
function databaseServer() {
    return html`
        ${box(
            "マネージドな SQL サービスを使用",
            html` <p>可用性のために冗長構成で構築</p>
                <p>
                    引き継ぐシステムがリレーショナルデータベースを使用したものであるため SQL
                    サービスを採用
                </p>`
        )}
        ${box(
            "SQL サービスをのよくない点",
            html` <p><i class="lnir lnir-close"></i> コストがかかる</p>
                <small><p>とはいえリレーショナルデータベースが最適なら採用すべき</p></small>`
        )}
        ${box(
            "代替案",
            html` <p>Key-Value ストアを使用</p>
                <p>グラフデータベースを使用</p>`
        )}
    `
}
