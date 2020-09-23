import { VNode } from "preact"
import { html } from "htm/preact"

export function LoginHeader(): VNode {
    return html`
        <header class="login__header">
            <cite class="login__brand">GETTO</cite>
            <strong class="login__title">Example</strong>
            <cite class="login__subTitle">code templates</cite>
        </header>
    `
}

export function ErrorView(title: VNode, content: VNode, footer: VNode): VNode {
    return html`
        <aside class="login">
            <section class="login__box">
                ${LoginHeader()}
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
