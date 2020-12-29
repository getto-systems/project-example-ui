import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { notice_alert, v_small } from "../../common/layout"

import { MenuListComponent, initialMenuListState } from "../../../auth/Outline/menuList/component"

import {
    Menu,
    MenuNode,
    MenuCategory,
    MenuItem,
    LoadMenuError,
    MenuCategoryPath,
} from "../../../auth/permission/menu/data"

type Props = Readonly<{
    menuList: MenuListComponent
}>
export function MenuList({ menuList }: Props): VNode {
    const [state, setState] = useState(initialMenuListState)
    useEffect(() => {
        menuList.onStateChange(setState)
        menuList.load()
    }, [])

    switch (state.type) {
        case "initial-menu-list":
            return EMPTY_CONTENT

        case "succeed-to-load":
        case "succeed-to-instant-load":
        case "succeed-to-toggle":
            return html`${content(state.menu)}`

        case "failed-to-load":
        case "failed-to-toggle":
            return html`${error(state.err)} ${content(state.menu)}`
    }

    function content(wholeMenu: Menu): VNode {
        // id="menu" は breadcrumb の href="#menu" と対応
        // mobile レイアウトで menu に移動
        return html`<nav id="menu" class="menu__body">${menuToHtml(wholeMenu)}</nav>`

        function menuToHtml(menu: Menu): VNode[] {
            return menu.map((node) => toNode(node))
        }
        function toNode(node: MenuNode): VNode {
            switch (node.type) {
                case "category":
                    return menuCategory(
                        node.category,
                        node.path,
                        node.children,
                        node.badgeCount,
                        node.isExpand
                    )

                case "item":
                    return menuItem(node.item, node.badgeCount, node.isActive)
            }
        }

        function menuCategory(
            category: MenuCategory,
            path: MenuCategoryPath,
            children: Menu,
            badgeCount: number,
            isExpand: boolean
        ) {
            const { label } = category

            return html`
                <details class="menu__nav" open=${isExpand} key=${label}>
                    <summary class="menu__nav__summary" onClick=${toggle}>
                        <span class="menu__nav__summary__label">${label}</span>
                        <span class="menu__nav__summary__badge">${badge(badgeCount)}</span>
                    </summary>
                    <ul class="menu__nav__items">
                        ${menuToHtml(children)}
                    </ul>
                </details>
            `

            function toggle(event: Event) {
                event.preventDefault()
                menuList.toggle(wholeMenu, path)
            }
        }

        function menuItem(item: MenuItem, badgeCount: number, isActive: boolean) {
            const { label, icon, href } = item
            const activeClass = isActive ? "menu__nav__item_active" : ""

            return html`
                <li class="menu__nav__item" key="${href}">
                    <a class="menu__nav__link ${activeClass}" href="${href}">
                        <span class="menu__nav__item__label">${labelWithIcon()}</span>
                        <span class="menu__nav__item__badge">${badge(badgeCount)}</span>
                    </a>
                </li>
            `

            function labelWithIcon() {
                return html`<i class="${icon}"></i> ${label}`
            }
        }
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
function loadMenuError(err: LoadMenuError): VNode[] {
    switch (err.type) {
        case "empty-nonce":
            return [notice_alert("認証エラー"), v_small(), detail("もう一度ログインしてください")]

        case "bad-request":
            return [notice_alert("アプリケーションエラー")]

        case "server-error":
            return [notice_alert("サーバーエラー")]

        case "bad-response":
            return [notice_alert("レスポンスエラー"), v_small(), detail(err.err)]

        case "infra-error":
            return [notice_alert("ネットワークエラー"), v_small(), detail(err.err)]
    }

    function detail(err: string) {
        return html`<small><p>詳細: ${err}</p></small>`
    }
}

const EMPTY_CONTENT = html``
