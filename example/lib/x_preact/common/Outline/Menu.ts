import { VNode } from "preact"
import { html } from "htm/preact"

import {
    appMenu,
    menuBody,
    menuBox,
    menuCategory,
    menuFooter,
    menuItem,
} from "../../../z_vendor/getto-css/preact/layout/app"
import { badge_alert, notice_alert } from "../../../z_vendor/getto-css/preact/design/highlight"

import { useApplicationAction } from "../hooks"
import { poweredBy } from "../site"

import { MenuComponent } from "../../../common/x_Resource/Outline/Menu/Menu/component"

import {
    OutlineMenu,
    OutlineMenuCategoryNode,
    OutlineMenuItemNode,
    LoadOutlineMenuBadgeError,
    FetchAuthzRepositoryError,
} from "../../../auth/permission/outline/load/data"

export const MENU_ID = "menu"

type Props = Readonly<{
    menu: MenuComponent
}>
export function Menu(resource: Props): VNode {
    const state = useApplicationAction(resource.menu)

    switch (state.type) {
        case "initial-menu":
            return EMPTY_CONTENT

        case "succeed-to-load":
        case "succeed-to-instant-load":
        case "succeed-to-toggle":
            return menu([content(state.menu)])

        case "failed-to-load":
        case "failed-to-toggle":
            return menu([menuBox(error(state.err)), content(state.menu)])

        case "failed-to-fetch-repository":
            return menu([menuBox(fetchError(state.err))])
    }

    function menu(content: VNode[]) {
        return appMenu([...content, menuFooter(poweredBy())])
    }

    function content(wholeMenu: OutlineMenu): VNode {
        // id="menu" は breadcrumb の href="#menu" と対応
        // mobile レイアウトで menu に移動
        return menuBody(MENU_ID, menuContent(wholeMenu, bareCategory))

        interface CategoryDecorator {
            (content: VNode): VNode
        }
        function bareCategory(content: VNode) {
            return content
        }
        function liCategory(content: VNode) {
            return html`<li>${content}</li>`
        }

        function menuContent(menu: OutlineMenu, categoryDecorator: CategoryDecorator): VNode[] {
            return menu.map((node) => {
                switch (node.type) {
                    case "category":
                        return categoryDecorator(menuCategoryContent(node))

                    case "item":
                        return menuItemContent(node)
                }
            })
        }

        function menuCategoryContent(node: OutlineMenuCategoryNode) {
            const { label } = node.category

            return menuCategory({
                isExpand: node.isExpand,
                label,
                toggle,
                badge: badge(node.badgeCount),
                children: menuContent(node.children, liCategory),
            })

            function toggle(event: Event) {
                event.preventDefault()
                resource.menu.toggle(wholeMenu, node.path)
            }
        }

        function menuItemContent(node: OutlineMenuItemNode) {
            const { label, icon, href } = node.item

            return menuItem({
                isActive: node.isActive,
                href,
                content: html`<i class="${icon}"></i> ${label}`,
                badge: badge(node.badgeCount),
            })
        }
    }
}

function badge(badgeCount: number) {
    if (badgeCount === 0) {
        return EMPTY_CONTENT
    }

    return badge_alert(html`${badgeCount}`)
}

function fetchError(err: FetchAuthzRepositoryError): VNode[] {
    switch (err.type) {
        case "not-found":
            return [
                notice_alert("認証エラー"),
                html`<small><p>もう一度ログインしてください</p></small>`,
            ]

        case "infra-error":
            return [notice_alert("ストレージエラー"), ...errorDetail(err.err)]
    }
}
function error(err: LoadOutlineMenuBadgeError): VNode[] {
    switch (err.type) {
        case "bad-request":
            return [notice_alert("アプリケーションエラー")]

        case "server-error":
            return [notice_alert("サーバーエラー")]

        case "bad-response":
            return [notice_alert("レスポンスエラー"), ...errorDetail(err.err)]

        case "infra-error":
            return [notice_alert("ネットワークエラー"), ...errorDetail(err.err)]
    }
}
function errorDetail(err: string): VNode[] {
    if (err.length === 0) {
        return []
    }
    return [html`<small><p>詳細: ${err}</p></small>`]
}

const EMPTY_CONTENT = html``
