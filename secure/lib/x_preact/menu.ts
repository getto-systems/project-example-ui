import { VNode } from "preact"
import { html } from "htm/preact"

/*
// ページ設定

type Category =
    "main" |
    "data"

type Page =
    "data" |
    "data/detail" |
    "home" |
    "docs"

const pages = [
    menu("main", [
        page("home", []),
        page("docs", []),
    ]),
    menu("data", [
        page("data", [
            page("data/detail", []),
        ]),
    ]),
]

const path = {
    "home": "/dist/index.html",
    "docs": "/dist/docs/index.html",

    "data": "/dist/data.html",
    "data/detail": "/dist/data/detail.html",
}

// 表示用設定

const title = {
    "home": "ホーム",
    "docs": "ドキュメント",

    "data": "データ",
    "data/detail": "編集",
}

const icon = {
    "home": "home",
    "docs": "files-alt",

    "data": "book-alt",
    "data/detail": "pencil",
}

// 実行時データ

const nonce = "api-nonce"
const roles = ["admin", "dev"]

const pathname = "/dist/index.html"

async function badge(_nonce) {
    return {
        "home": 99,
    }
}

const season = "ことし"

const version = "dist"
 */

export function Nav(): VNode {
    return html`
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
        <details class="menu__nav" open="${false}">
            <summary class="menu__nav__summary">
                DATA
            </summary>
            <ul class="menu__nav__items">
                <li class="menu__nav__item">
                    <a class="menu__nav__link" href="/dist/docs/index.html">
                        <i class="lnir lnir-book-alt"></i> データ
                    </a>
                </li>
            </ul>
        </details>
    `
}

export function Breadcrumb(): VNode {
    return html`
        <p class="main__breadcrumb">
            <a class="main__breadcrumb__item" href="#menu">MAIN</a>
            <span class="main__breadcrumb__separator"><i class="lnir lnir-chevron-right"></i></span>
            <a class="main__breadcrumb__item" href="/dist/index.html"><i class="lnir lnir-home"></i> ホーム</a>
        </p>
    `
}
