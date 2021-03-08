import { authzRepositoryConverter } from "../../../../common/authz/convert"
import { menuExpandRepositoryConverter } from "../../kernel/impl/convert"

import { LoadMenuInfra } from "../infra"

import { LoadMenuPod } from "../method"

import { LoadMenuEvent } from "../event"

import { AuthzRoles } from "../../../../common/authz/data"
import {
    appendMenuCategoryPath,
    MenuCategoryPathSet,
    MenuExpand,
    MenuPermission,
    MenuTree,
    MenuTreeCategory,
    MenuTreeItem,
    MenuTreeNode,
    toMenuCategory,
    toMenuItem,
} from "../../kernel/infra"
import { Menu, MenuCategoryPath, MenuNode } from "../../kernel/data"

interface Load {
    (infra: LoadMenuInfra): LoadMenuPod
}
export const loadMenu: Load = (infra) => (detecter) => async (post) => {
    const { version } = infra
    const authz = infra.authz(authzRepositoryConverter)
    const menuExpand = infra.menuExpand(menuExpandRepositoryConverter)

    const authzResult = authz.get()
    if (!authzResult.success) {
        post({ type: "repository-error", err: authzResult.err })
        return
    }
    if (!authzResult.found) {
        authz.remove()
        post({ type: "required-to-login" })
        return
    }

    const menuExpandResult = menuExpand.get()
    if (!menuExpandResult.success) {
        post({ type: "repository-error", err: menuExpandResult.err })
        return
    }

    const roles = authzResult.value.roles
    const expand = menuExpandResult.found ? menuExpandResult.value : EMPTY_EXPAND

    post({ type: "succeed-to-load", menu: buildMenu(roles, expand) })

    function buildMenu(permittedRoles: AuthzRoles, expand: MenuExpand): Menu {
        const menuTarget = detecter()

        const menuExpandSet = new MenuCategoryPathSet()
        menuExpandSet.init(expand)

        return toMenu(infra.menuTree, [])

        function toMenu(menuTree: MenuTree, categoryPath: MenuCategoryPath): Menu {
            return menuTree.flatMap((node) => toMenuNodes(node, categoryPath))
        }
        function toMenuNodes(node: MenuTreeNode, categoryPath: MenuCategoryPath): MenuNode[] {
            switch (node.type) {
                case "item":
                    return [itemNode(node.item)]

                case "category":
                    return categoryNode(
                        node.category,
                        node.children,
                        appendMenuCategoryPath(categoryPath, node.category),
                    )
            }
        }

        function itemNode(item: MenuTreeItem): MenuNode {
            return {
                type: "item",
                isActive: menuTarget.valid ? item.path === menuTarget.value : false,
                badgeCount: 0, // badge count は後でロードされる
                item: toMenuItem(item, version),
            }
        }

        function categoryNode(
            category: MenuTreeCategory,
            menuTree: MenuTree,
            path: MenuCategoryPath,
        ): MenuNode[] {
            if (!isAllow(category.permission)) {
                return EMPTY_MENU
            }

            const children = toMenu(menuTree, path)
            if (children.length === 0) {
                return EMPTY_MENU
            }

            return [
                {
                    type: "category",
                    isExpand: menuExpandSet.hasEntry(path) || children.some(hasActive),
                    badgeCount: 0, // badge count は後でロードされる
                    category: toMenuCategory(category),
                    children,
                    path,
                },
            ]

            function isAllow(permission: MenuPermission): boolean {
                switch (permission.type) {
                    case "allow":
                        return true

                    case "any":
                        return permission.permits.some(isAllow)

                    case "all":
                        return permission.permits.every(isAllow)

                    case "role":
                        return permittedRoles.includes(permission.role)
                }
            }
            function hasActive(node: MenuNode): boolean {
                switch (node.type) {
                    case "category":
                        return node.children.some(hasActive)
                    case "item":
                        return node.isActive
                }
            }
        }
    }
}

export function loadMenuEventHasDone(_event: LoadMenuEvent): boolean {
    return true
}

const EMPTY_EXPAND: MenuExpand = []
const EMPTY_MENU: MenuNode[] = []
