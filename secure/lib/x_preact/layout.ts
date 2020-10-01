import { VNode } from "preact"
import { html } from "htm/preact"

// TODO public と secure で共有したい : env を使うとするとコンポーネントから送ってもらわないといけなくて大ごとだから・・・
const brand = "GETTO"
const title = "Example"
const subTitle = "code templates"

export function menuHeader(): VNode {
    return html`
        <header class="layout__menu__header menu__header">
            <cite class="menu__brand">${brand}</cite>
            <strong class="menu__title">${title}</strong>
            <cite class="menu__subTitle">${subTitle}</cite>
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

export function applicationError(title: VNode, content: VNode, footer: VNode): VNode {
    return html`
        <aside class="login">
            <section class="login__box">
                <header class="login__header">
                    <cite class="login__brand">${brand}</cite>
                    <strong class="login__title">${title}</strong>
                    <cite class="login__subTitle">${subTitle}</cite>
                </header>
                <section class="login__message">
                    <h3 class="login__message__title">${title}</h3>
                    <section class="login__message__body paragraph">${content}</section>
                </section>
                <footer class="login__footer">
                    ${footer}
                </footer>
            </section>
        </aside>
    `
}
