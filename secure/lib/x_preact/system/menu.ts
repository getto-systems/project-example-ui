import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { iconClass } from "../../z_external/icon"

import {
    unpackMenuLabel,
    unpackMenuIcon,
    unpackMenuBadgeCount,
    unpackMenuHref,
} from "../../menu/adapter"

import { MenuComponent, initialMenuState } from "../../system/component/menu/component"

import { Menu, MenuNode, MenuCategory, MenuItem, LoadMenuError } from "../../menu/data"

type Props = Readonly<{
    menu: MenuComponent
}>

export function MenuList({ menu }: Props): VNode {
    const [state, setState] = useState(initialMenuState)
    useEffect(() => {
        menu.onStateChange(setState)
        menu.action({ type: "load-menu" })
    }, [])

    switch (state.type) {
        case "initial-menu":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return html`${content(state.menu)}`

        case "failed-to-load":
            return html`${error(state.err)} ${content(state.menu)}`
    }
}

function content(menu: Menu): VNode {
    // id="menu" は breadcrumb の href="#menu" と対応
    // mobile レイアウトで menu に移動
    return html`<nav id="menu" class="menu__body">${menu.map(toNode)}</nav>`
}

function toNode(node: MenuNode): VNode {
    switch (node.type) {
        case "category":
            return menuCategory(node.category, node.children)

        case "item":
            return menuItem(node.item)
    }
}

function menuCategory(category: MenuCategory, children: Menu) {
    const label = unpackMenuLabel(category.label)
    const badgeCount = unpackMenuBadgeCount(category.badgeCount)

    return html`
        <details class="menu__nav" open="${category.isExpand}">
            <summary class="menu__nav__summary">
                <span class="menu__nav__summary__label">${label}</span>
                <span class="menu__nav__summary__badge">${badge(badgeCount)}</span>
            </summary>
            <ul class="menu__nav__items">
                ${children.map(toNode)}
            </ul>
        </details>
    `
}

function menuItem(item: MenuItem) {
    const href = unpackMenuHref(item.href)
    const icon = unpackMenuIcon(item.icon)
    const label = unpackMenuLabel(item.label)
    const badgeCount = unpackMenuBadgeCount(item.badgeCount)
    const activeClass = item.isActive ? "menu__nav__item_active" : ""

    return html`
        <li class="menu__nav__item">
            <a class="menu__nav__link ${activeClass}" href="${href}">
                <span class="menu__nav__item__label">${labelWithIcon()}</span>
                <span class="menu__nav__item__badge">${badge(badgeCount)}</span>
            </a>
        </li>
    `

    function labelWithIcon() {
        return html`<i class="${iconClass(icon)}"></i> ${label}`
    }
}

function badge(badgeCount: number) {
    if (badgeCount === 0) {
        return EMPTY_CONTENT
    }

    return html`<span class="badge badge_alert">${badgeCount}</span>`
}

function error(err: LoadMenuError): VNode {
    return html`<section class="menu__box">${loadMenuError(err)}</section>`
}
function loadMenuError(err: LoadMenuError): VNode {
    switch (err.type) {
        case "bad-request":
            return notice("アプリケーションエラー", { isStacked: false })

        case "server-error":
            return notice("サーバーエラー", { isStacked: false })

        case "bad-response":
            return html`${notice("レスポンスエラー", { isStacked: true })} ${detail(err)}`

        case "infra-error":
            return html`${notice("ネットワークエラー", { isStacked: true })} ${detail(err)}`
    }

    function notice(message: string, { isStacked }: { isStacked: boolean }) {
        const stackClass = isStacked ? "notice_stack" : ""
        return html`<p class="notice notice_alert ${stackClass}">${message}</p>`
    }
    function detail({ err }: { err: string }) {
        return html`<small><p>詳細: ${err}</p></small>`
    }
}

const EMPTY_CONTENT = html``
