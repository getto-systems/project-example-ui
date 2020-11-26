import { VNode } from "preact"
import { html } from "htm/preact"
import { box, box_double, v_small } from "../box"

export function content_index(): VNode {
    return html`
        ${box_double(
            "GETTO Example のゴール",
            html`
                <p>業務アプリケーションで使用可能な、ベースとなるテンプレートを提供</p>
                ${v_small()}
                <p>各プロジェクトで、このテンプレートをコビーして始められるようにしたい</p>
            `
        )}
        ${box_double(
            "Web アプリケーションのゴール",
            html`<p>ストレスなく使用できて、ドメインのゴール達成を支援する</p>`
        )}
        ${box("認証・認可のゴール", html`<p>ストレスなく使用できて、セキュア</p>`)}
    `
}
