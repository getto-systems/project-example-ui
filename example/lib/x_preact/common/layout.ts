import { VNode } from "preact"
import { html } from "htm/preact"

export type VNodeContent = VNodeEntry | VNodeEntry[]
type VNodeEntry = string | VNode

export type SiteInfo = Readonly<{
    brand: string
    title: string
    subTitle: string
}>

export function siteInfo(): SiteInfo {
    return {
        brand: "GETTO",
        title: "Example",
        subTitle: "code templates",
    }
}

export function loginHeader(): VNode {
    const { brand, title, subTitle } = siteInfo()
    return html`
        <header class="login__header">
            <cite class="login__brand">${brand}</cite>
            <strong class="login__title">${title}</strong>
            <cite class="login__subTitle">${subTitle}</cite>
        </header>
    `
}

export function fullScreenError(
    title: VNodeContent,
    content: VNodeContent,
    footer: VNodeContent
): VNode {
    return html`
        <aside class="login">
            <section class="login__box">
                ${loginHeader()}
                <section class="login__message">
                    <h3 class="login__message__title">${title}</h3>
                    <section class="login__message__body">${content}</section>
                </section>
                <footer class="login__footer">${footer}</footer>
            </section>
        </aside>
    `
}
