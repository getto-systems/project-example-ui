import { VNode } from "preact"
import { html } from "htm/preact"
import { box, v_medium } from "../box"

export function content_server(): VNode {
    return html`
        ${box(
            "サービスの継続提供のために",
            html`
                <p>ランニングコストの削減</p>
                <p>デプロイコストの削減</p>
                <p>アップグレードコストの削減</p>
                ${v_medium()}
                <p>ランニングコスト: 12,000円/月</p>
            `
        )}
        ${box(
            "ストレスのない使用のために",
            html`
                <p>必要な時に使用可能</p>
                <p>使用中に操作が中断されない</p>
                ${v_medium()}
                <p>業務時間内での停止許容時間: 5分/8h</p>
                <small><p>業務時間外はメンテナンスの連絡後停止可能</p></small>
                <p>レスポンスの最大時間: 1秒</p>
                <small><p>処理自体に時間がかかる場合は完了時に通知を行う</p></small>
            `
        )}
    `
}
