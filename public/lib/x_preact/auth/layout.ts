import { VNode } from "preact"
import { html } from "htm/preact"

export function LoginView(content: VNode): VNode {
    return html`
        <aside class="login">
            <section class="login__box">
                <header class="login__header">
                    <cite class="login__brand">GETTO</cite>
                    <strong class="login__title">Example</strong>
                    <cite class="login__subTitle">code templates</cite>
                </header>
                ${content}
            </section>
        </aside>
    `
}

export function ErrorView(title: VNode, content: VNode, footer: VNode): VNode {
    return LoginView(html`
        <section class="login__message">
            <h3 class="login__message__header">${title}</h3>
            <section class="login__message__body paragraph">${content}</section>
        </section>
        <section class="login__footer">
            ${footer}
        </section>
    `)
}
