import { VNode } from "preact"
import { html } from "htm/preact"

import { siteInfo } from "../common/layout"

export function menuHeader(): VNode {
    const { brand, title, subTitle } = siteInfo()
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
