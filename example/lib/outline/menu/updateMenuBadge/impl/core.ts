import { authzRepositoryConverter } from "../../../../common/authz/convert"
import { menuBadgeRemoteConverter } from "../../kernel/impl/convert"

import { MenuBadge, toMenuPath } from "../../kernel/infra"
import { UpdateMenuBadgeInfra } from "../infra"

import { UpdateMenuBadgeMethod } from "../method"

import { UpdateMenuBadgeEvent } from "../event"

import { Menu, MenuCategoryNode, MenuItemNode, MenuNode } from "../../kernel/data"

interface Update {
    (infra: UpdateMenuBadgeInfra): UpdateMenuBadgeMethod
}
export const updateMenuBadge: Update = (infra) => async (oldMenu, post) => {
    const getMenuBadge = infra.getMenuBadge(menuBadgeRemoteConverter)
    const authz = infra.authz(authzRepositoryConverter)

    const result = authz.get()
    if (!result.success) {
        post({ type: "repository-error", err: result.err })
        return
    }
    if (!result.found) {
        authz.remove()
        post({ type: "required-to-login" })
        return
    }

    const response = await getMenuBadge(result.value.nonce)
    if (!response.success) {
        post({ type: "failed-to-update", menu: oldMenu, err: response.err })
        return
    }

    post({ type: "succeed-to-update", menu: updateMenu(response.value) })

    function updateMenu(menuBadge: MenuBadge): Menu {
        return updateBadgeCount(oldMenu)

        function updateBadgeCount(menu: Menu): Menu {
            return menu.map(updateNodeBadgeCount)
        }
        function updateNodeBadgeCount(node: MenuNode): MenuNode {
            switch (node.type) {
                case "category":
                    return categoryNode(node)
                case "item":
                    return itemNode(node)
            }
        }

        function categoryNode(node: MenuCategoryNode): MenuNode {
            const children = updateBadgeCount(node.children)

            return {
                ...node,
                children,
                badgeCount: children.reduce((acc, node) => acc + node.badgeCount, 0),
            }
        }

        function itemNode(node: MenuItemNode): MenuNode {
            const { version } = infra
            return {
                ...node,
                badgeCount: menuBadge[toMenuPath(node.item, version)] || 0,
            }
        }
    }
}

export function updateMenuBadgeEventHasDone(_event: UpdateMenuBadgeEvent): boolean {
    return true
}
