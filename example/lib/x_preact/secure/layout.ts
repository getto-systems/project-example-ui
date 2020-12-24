import { VNode } from "preact"
import { html } from "htm/preact"

import { siteInfo, VNodeContent } from "../common/layout"

export function menuHeader(): VNode {
    const { brand, title, subTitle} = siteInfo()
    return html`
        <header class="layout__menu__header menu__header">
            <cite class="menu__brand">${brand}</cite>
            <strong class="menu__title">${title}</strong>
            <cite class="menu__subTitle">${subTitle}</cite>
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
    return notice("notice_info", content)
}
function notice(noticeClass: string, content: VNodeContent): VNode {
    return html`<p class="notice ${noticeClass}">${content}</p>`
}

export function label_alert(content: VNodeContent): VNode {
    return label("label_alert", content)
}
export function label_pending(content: VNodeContent): VNode {
    return label("label_pending", content)
}
function label(noticeClass: string, content: VNodeContent): VNode {
    return html`<span class="label ${noticeClass}">${content}</span>`
}
