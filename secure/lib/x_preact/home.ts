import { render, h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { SystemInfo } from "./system"
import { Nav, Breadcrumb } from "./menu"

import { mainFooter, menuHeader, menuFooter } from "./layout"

// TODO Main を作ってコンポーネントを出しわける
render(h(Home, {}), document.body)

function Home(): VNode {
    const [_state, _setState] = useState({ type: "initial" })
    const [version, _setVersion] = useState({ current: "" })
    /*
    useEffect(() => {
        component.onStateChange(setState)
        component.onVersionLoad(setVersion)
        return component.init()
    }, [])
     */

    useEffect(() => {
        document.title = `ホーム | ${document.title}`
    }, [])

    const mainTitle = html`ホーム`

    return html`
        <main class="layout">
            <article class="layout__main">
                <header class="main__header">
                    <h1 class="main__title">${mainTitle}</h1>
                    ${h(Breadcrumb, {})}
                </header>
                <section class="main__body container">
                    ${h(Example, {})}
                </section>
                ${mainFooter()}
            </article>
            <aside class="layout__menu menu">
                ${menuHeader()}
                <nav id="menu" class="menu__body">
                    ${h(SystemInfo, {})}
                    ${h(Nav, {})}
                </nav>
                ${menuFooter(version.current)}
            </aside>
        </main>
    `
}

function Example(): VNode {
    return html`
        <section class="box box_double">
            <div>
                <header class="box__header">
                    <h2 class="box__title">GETTO Example</h2>
                </header>
                <section class="box__body">
                    <dl class="form">
                        <dt class="form__header">バージョン</dt>
                        <dd class="form__field">
                            さいしん
                        </dd>
                    </dl>
                </section>
            </div>
            <footer class="box__footer">
                <section class="button__container">
                    <a class="#">リンク</a>
                </section>
            </footer>
        </section>
    `
}
