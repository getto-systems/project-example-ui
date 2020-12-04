import { html } from "htm/preact"
import { VNode } from "preact"

import { VNodeContent } from "../../../../layout"
import { box, formWithHelp, iconSection } from "../../box"

export const hr: VNode = html`<hr />`

const contentServer = html`<i class="lnir lnir-database"></i> コンテンツサーバー`
const apiServer = html`<i class="lnir lnir-cogs"></i> API サーバー`
const browser = html`<i class="lnir lnir-display"></i> ブラウザ`
const textMessage = html`<i class="lnir lnir-envelope"></i> テキストメッセージクライアント`

export function serverClients(): VNode {
    return box("前提とするサーバー・クライアント", [
        iconSection("lnir lnir-database", "コンテンツサーバー", "（CDN : CloudFront など）"),
        iconSection("lnir lnir-cogs", "API サーバー", "（アプリケーションサーバー）"),
        iconSection("lnir lnir-display", "http クライアント", "（ブラウザ、スマホアプリ）"),
        iconSection("lnir lnir-envelope", "テキストメッセージクライアント", "（メール、slack）"),
    ])    
}

export function inBrowser(content: VNodeContent, help: VNodeContent[]): VNode {
    return formWithHelp(browser, content, help)
}

export function toContentServer(content: VNodeContent, help: VNodeContent[]): VNode {
    return toServer(contentServer, content, help)
}
export function inContentServer(content: VNodeContent, help: VNodeContent[]): VNode {
    return formWithHelp(contentServer, content, help)
}

export function toApiServer(content: VNodeContent, help: VNodeContent[]): VNode {
    return toServer(apiServer, content, help)
}
export function inApiServer(content: VNodeContent, help: VNodeContent[]): VNode {
    return formWithHelp(apiServer, content, help)
}
export function fromApiServer(content: VNodeContent, help: VNodeContent[]): VNode {
    return fromServer(apiServer, content, help)
}

export function toTextMessage(content: VNodeContent, help: VNodeContent[]): VNode {
    return formWithHelp(
        html`
            ${apiServer} ${" "}
            <i class="lnir lnir-arrow-right"></i>
            ${" "} ${textMessage}
        `,
        content,
        help
    )
}

function toServer(server: VNodeContent, content: VNodeContent, help: VNodeContent[]) {
    return formWithHelp(
        html`
            ${browser} ${" "}
            <i class="lnir lnir-arrow-right"></i>
            ${" "} ${server}
        `,
        content,
        help
    )
}
function fromServer(server: VNodeContent, content: VNodeContent, help: VNodeContent[]) {
    return formWithHelp(
        html`
            ${server} ${" "}
            <i class="lnir lnir-arrow-right"></i>
            ${" "} ${browser}
        `,
        content,
        help
    )
}
