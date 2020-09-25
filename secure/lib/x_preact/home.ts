import { render, h, VNode } from "preact"
import { html } from "htm/preact"

render(h(Main, {}), document.body)

function Main(): VNode {
    return html`
        <main class="layout">
            <article class="layout__main">
                <header class="main__header">
                    <h1 class="main__title">ホーム</h1>
                    ${h(Breadcrumb, {})}
                </header>
                <section class="main__body container">
                    ${h(Example, {})}
                </section>
                ${mainFooter()}
            </article>
            ${h(Menu, {})}
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

function Menu(): VNode {
    return html`
        <aside class="layout__menu menu">
            ${menuHeader()}
            <nav id="menu" class="menu__body">
                <section class="menu__box">
                    <dl class="form">
                        <dt class="form__header">シーズン</dt>
                        <dd class="form__field">
                            ことし
                        </dd>
                    </dl>
                </section>
                <details class="menu__nav" open="${true}">
                    <summary class="menu__nav__summary">
                        <span class="menu__nav__summary__label">MAIN</span>
                        <span class="menu__nav__summary__badge">
                            <span class="badge badge_alert">99</span>
                        </span>
                    </summary>
                    <ul class="menu__nav__items">
                        <li class="menu__nav__item">
                            <a class="menu__nav__link menu__nav__item_active" href="/dist/index.html">
                                <span class="menu__nav__item__label">
                                    <i class="lnir lnir-home"></i> ホーム
                                </span>
                                <span class="menu__nav__item__badge">
                                    <span class="badge badge_alert">99</span>
                                </span>
                            </a>
                        </li>
                        <li class="menu__nav__item">
                            <a class="menu__nav__link" href="/dist/docs/index.html">
                                <i class="lnir lnir-files-alt"></i> ドキュメント
                            </a>
                        </li>
                    </ul>
                </details>
            </nav>
            ${menuFooter("dist")}
        </aside>
    `
}

function Breadcrumb(): VNode {
    return html`
        <p class="main__breadcrumb">
            <a class="main__breadcrumb__item" href="#menu">MAIN</a>
            <span class="main__breadcrumb__separator"><i class="lnir lnir-chevron-right"></i></span>
            <a class="main__breadcrumb__item" href="/dist/index.html"><i class="lnir lnir-home"></i> ホーム</a>
        </p>
    `
}

function menuHeader(): VNode {
    return html`
        <header class="layout__menu__header menu__header">
            <cite class="menu__brand">GETTTO</cite>
            <strong class="menu__title">Example</strong>
            <cite class="menu__subTitle">code templates</cite>
        </header>
    `
}

function menuFooter(version: string): VNode {
    return html`
        <footer class="menu__footer">
            <p class="menu__footer__message">copyright GETTO.systems</p>
            <p class="menu__footer__message">version: ${version}</p>
        </footer>
    `
}

function mainFooter(): VNode {
    return html`
        <footer class="main__footer">
            <p class="main__footer__message">
                powered by : LineIcons / みんなの文字
            </p>
        </footer>
    `
}
