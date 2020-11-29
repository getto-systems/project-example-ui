import { VNode } from "preact"
import { html } from "htm/preact"

export type VNodeContent = VNodeEntry | VNodeEntry[]
type VNodeEntry = string | VNode

const application = {
    brand: "GETTO",
    title: "Example",
    subTitle: "code templates",
}

export function menuHeader(): VNode {
    return html`
        <header class="layout__menu__header menu__header">
            <cite class="menu__brand">${application.brand}</cite>
            <strong class="menu__title">${application.title}</strong>
            <cite class="menu__subTitle">${application.subTitle}</cite>
        </header>
    `
}

export function menuFooter(): VNode {
    return html`
        <footer class="menu__footer">
            <p class="menu__footer__message">copyright : GETTO.systems</p>
        </footer>
    `
}

export function footer(): VNode {
    return html`
        <footer class="main__footer">
            <p class="main__footer__message">powered by : LineIcons / みんなの文字</p>
        </footer>
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
                <header class="login__header">
                    <cite class="login__brand">${application.brand}</cite>
                    <strong class="login__title">${application.title}</strong>
                    <cite class="login__subTitle">${application.subTitle}</cite>
                </header>
                <section class="login__message">
                    <h3 class="login__message__title">${title}</h3>
                    <section class="login__message__body paragraph">${content}</section>
                </section>
                <footer class="login__footer">${footer}</footer>
            </section>
        </aside>
    `
}

export function container(contents: VNodeContent): VNode {
    return html`<section class="container">${contents}</section>`
}

export function v_small(): VNode {
    return vertical("vertical_small")
}
export function v_medium(): VNode {
    return vertical("vertical_medium")
}
function vertical(verticalClass: string): VNode {
    return html`<div class="vertical ${verticalClass}"></div>`
}

export function notice_alert(content: VNodeContent): VNode {
    return notice("notice_alert", content)
}
export function notice_info(content: VNodeContent): VNode {
    return notice("notice_warning", content)
}
function notice(noticeClass: string, content: VNodeContent): VNode {
    return html`<p class="notice ${noticeClass}">${content}</p>`
}
