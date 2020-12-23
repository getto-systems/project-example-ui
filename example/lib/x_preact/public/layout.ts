import { VNode } from "preact"
import { html } from "htm/preact"

const brand = "GETTO"
const title = "Example"
const subTitle = "code templates"

export function loginHeader(): VNode {
    return html`
        <header class="login__header">
            <cite class="login__brand">${brand}</cite>
            <strong class="login__title">${title}</strong>
            <cite class="login__subTitle">${subTitle}</cite>
        </header>
    `
}

export function fullScreenError(title: VNode, content: VNode, footer: VNode): VNode {
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
