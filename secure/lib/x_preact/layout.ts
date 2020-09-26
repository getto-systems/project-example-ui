import { VNode } from "preact"
import { html } from "htm/preact"

export function menuHeader(): VNode {
    return html`
        <header class="layout__menu__header menu__header">
            <cite class="menu__brand">GETTTO</cite>
            <strong class="menu__title">Example</strong>
            <cite class="menu__subTitle">code templates</cite>
        </header>
    `
}

export function menuFooter(version: string): VNode {
    return html`
        <footer class="menu__footer">
            <p class="menu__footer__message">copyright GETTO.systems</p>
            <p class="menu__footer__message">version: ${version}</p>
        </footer>
    `
}

export function mainFooter(): VNode {
    return html`
        <footer class="main__footer">
            <p class="main__footer__message">
                powered by : LineIcons / みんなの文字
            </p>
        </footer>
    `
}
