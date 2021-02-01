import { VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { menuBody, menuBox, menuCategory, menuItem } from "../../z_external/getto-css/preact/layout/app"
import { badge_alert, notice_alert } from "../../z_external/getto-css/preact/design/highlight"

import { useComponent } from "../common/hooks"

import { MenuListComponent, initialMenuListState } from "../../auth/Outline/menuList/component"

import { Menu, MenuCategoryNode, MenuItemNode, LoadMenuError } from "../../auth/permission/menu/data"

export const MENU_ID = "menu"

type Props = Readonly<{
    menuList: MenuListComponent
}>
export function MenuList({ menuList }: Props): VNode {
    const state = useComponent(menuList, initialMenuListState)
    useEffect(() => {
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
        return menuBody(MENU_ID, menuContent(wholeMenu))

        function menuContent(menu: Menu): VNode[] {
            return menu.map((node) => {
                switch (node.type) {
                    case "category":
                        return menuCategoryContent(node)

                    case "item":
                        return menuItemContent(node)
                }
            })
        }

        function menuCategoryContent(node: MenuCategoryNode) {
            const { label } = node.category

            return menuCategory({
                isExpand: node.isExpand,
                label,
                toggle,
                badge: badge(node.badgeCount),
                children: menuContent(node.children),
            })

            function toggle(event: Event) {
                event.preventDefault()
                menuList.toggle(wholeMenu, node.path)
            }
        }

        function menuItemContent(node: MenuItemNode) {
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

function error(err: LoadMenuError): VNode {
    return menuBox(loadMenuError(err))
}
function loadMenuError(err: LoadMenuError): VNode[] {
    switch (err.type) {
        case "empty-nonce":
            return [notice_alert("認証エラー"), detail("もう一度ログインしてください")]

        case "bad-request":
            return [notice_alert("アプリケーションエラー")]

        case "server-error":
            return [notice_alert("サーバーエラー")]

        case "bad-response":
            return [notice_alert("レスポンスエラー"), detail(err.err)]

        case "infra-error":
            return [notice_alert("ネットワークエラー"), detail(err.err)]
    }

    function detail(err: string) {
        return html`<small><p>詳細: ${err}</p></small>`
    }
}

const EMPTY_CONTENT = html``
