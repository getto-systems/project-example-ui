import {
    LoadBreadcrumbInfra,
    LoadMenuInfra,
    MenuBadge,
    MenuExpand,
    MenuTree,
    MenuTreeNode,
    MenuTreeCategory,
    MenuTreeItem,
    ToggleMenuExpandInfra,
    MenuCategoryPathSet,
} from "../infra"

import { LoadBreadcrumbPod, LoadMenuPod, ToggleMenuExpandPod } from "../action"

import { ApiRoles, LoadResult } from "../../../common/credential/data"
import {
    Breadcrumb,
    BreadcrumbNode,
    Menu,
    MenuCategory,
    MenuItem,
    markMenuItem,
    MenuNode,
    MenuTarget,
    MenuCategoryPath,
    markMenuCategoryLabel,
    MenuCategoryLabel,
} from "../data"

export const loadBreadcrumb = (infra: LoadBreadcrumbInfra): LoadBreadcrumbPod => (collector) => async (
    post
) => {
    const { menuTree } = infra

    post({
        type: "succeed-to-load",
        breadcrumb: toBreadcrumb({
            menuTree,
            menuTarget: collector.getMenuTarget(),
        }),
    })
}

type BreadcrumbInfo = Readonly<{
    menuTree: MenuTree
    menuTarget: MenuTarget
}>

function toBreadcrumb({ menuTree, menuTarget }: BreadcrumbInfo): Breadcrumb {
    if (!menuTarget.versioned) {
        return []
    }
    const { version, currentPath } = menuTarget

    return menuTreeToBreadcrumb(menuTree)

    function menuTreeToBreadcrumb(menuTree: MenuTree): Breadcrumb {
        for (let i = 0; i < menuTree.length; i++) {
            const breadcrumb = breadcrumbNodes(menuTree[i])
            if (breadcrumb.length > 0) {
                return breadcrumb
            }
        }
        return EMPTY_BREADCRUMB
    }
    function breadcrumbNodes(node: MenuTreeNode): BreadcrumbNode[] {
        switch (node.type) {
            case "category":
                return breadcrumbCategory(node.category, node.children)
            case "item":
                return breadcrumbItem(node.item)
        }
    }
    function breadcrumbCategory(category: MenuTreeCategory, children: MenuTree): BreadcrumbNode[] {
        const breadcrumb = menuTreeToBreadcrumb(children)
        if (breadcrumb.length === 0) {
            return EMPTY_BREADCRUMB
        }
        return [{ type: "category", category: toMenuCategory(category) }, ...breadcrumb]
    }
    function breadcrumbItem(item: MenuTreeItem): BreadcrumbNode[] {
        if (item.path !== currentPath) {
            return EMPTY_BREADCRUMB
        }
        return [{ type: "item", item: toMenuItem(item, version) }]
    }
}

export const loadMenu = (infra: LoadMenuInfra): LoadMenuPod => (collector) => async (
    nonce,
    roles,
    post
) => {
    const { menuTree, menuExpands, menuBadge } = infra

    const info: MenuInfo = {
        menuTree: menuTree,
        roles,
        menuTarget: collector.getMenuTarget(),
    }

    const menuExpandResponse = menuExpands.findMenuExpand()
    if (!menuExpandResponse.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, EMPTY_EXPAND, EMPTY_BADGE),
            err: menuExpandResponse.err,
        })
        return
    }

    // badge の取得には時間がかかる可能性があるのでまず空 badge で返す
    // expand の取得には時間がかからないはずなので expand の取得前には返さない
    post({
        type: "succeed-to-instant-load",
        menu: toMenu(info, menuExpandResponse.menuExpand, EMPTY_BADGE),
    })

    if (!nonce.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, menuExpandResponse.menuExpand, EMPTY_BADGE),
            err: { type: "empty-nonce" },
        })
        return
    }

    const menuBadgeResponse = await menuBadge.getBadge(nonce.content)
    if (!menuBadgeResponse.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, menuExpandResponse.menuExpand, EMPTY_BADGE),
            err: menuBadgeResponse.err,
        })
        return
    }

    post({
        type: "succeed-to-load",
        menu: toMenu(info, menuExpandResponse.menuExpand, menuBadgeResponse.menuBadge),
    })
}

type MenuInfo = Readonly<{
    menuTree: MenuTree
    roles: LoadResult<ApiRoles>
    menuTarget: MenuTarget
}>

function toMenu(
    { menuTree, menuTarget, roles }: MenuInfo,
    menuExpand: MenuExpand,
    menuBadge: MenuBadge
): Menu {
    const menuExpandSet = new MenuCategoryPathSet()
    menuExpandSet.init(menuExpand)

    return menuTreeToMenu(menuTree, [])

    function menuTreeToMenu(menuTree: MenuTree, categoryPath: MenuCategoryPath): Menu {
        return menuTree.flatMap((node) => menuNodes(node, categoryPath))
    }
    function menuNodes(node: MenuTreeNode, categoryPath: MenuCategoryPath): MenuNode[] {
        switch (node.type) {
            case "category":
                return menuCategory(node.category, node.children, [
                    ...categoryPath,
                    markMenuCategoryLabel(node.category.label),
                ])
            case "item":
                return [menuItem(node.item)]
        }
    }
    function menuCategory(
        category: MenuTreeCategory,
        menuTree: MenuTree,
        path: MenuCategoryPath
    ): MenuNode[] {
        if (!isAllow()) {
            return EMPTY_MENU
        }

        const children = menuTreeToMenu(menuTree, path)
        if (children.length === 0) {
            return EMPTY_MENU
        }

        const sumBadgeCount = children.reduce((acc, node) => acc + node.badgeCount, 0)

        return [
            {
                type: "category",
                isExpand: menuExpandSet.hasEntry(path) || children.some(hasActive),
                badgeCount: sumBadgeCount,
                category: toMenuCategory(category),
                children,
                path,
            },
        ]

        function isAllow(): boolean {
            switch (category.permission.type) {
                case "any":
                    return true
                case "role":
                    if (!roles.success) {
                        return false
                    }
                    return category.permission.roles.some((role) => {
                        return roles.content.includes(role)
                    })
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
    function menuItem(item: MenuTreeItem): MenuNode {
        return {
            type: "item",
            isActive: menuTarget.versioned ? item.path === menuTarget.currentPath : false,
            badgeCount: menuBadge[item.path] || 0,
            item: toMenuItem(item, menuTarget.version),
        }
    }
}

function toMenuCategory(category: MenuTreeCategory): MenuCategory {
    return {
        label: markMenuCategoryLabel(category.label),
    }
}
function toMenuItem({ label, icon, path }: MenuTreeItem, version: string): MenuItem {
    return markMenuItem({ label, icon, href: `/${version}${path}` })
}

export const toggleMenuExpand = (infra: ToggleMenuExpandInfra): ToggleMenuExpandPod => () => (
    menu,
    path,
    post
) => {
    const { menuExpands } = infra

    const updatedMenu = toggleMenu(menu, path)

    const response = menuExpands.saveMenuExpand(gatherMenuExpand(updatedMenu, []))
    if (!response.success) {
        post({ type: "failed-to-toggle", menu: updatedMenu, err: response.err })
        return
    }

    post({ type: "succeed-to-toggle", menu: updatedMenu })

    function gatherMenuExpand(target: Menu, path: MenuCategoryPath): MenuExpand {
        const expand: MenuExpand = []
        target.forEach((node) => {
            switch (node.type) {
                case "item":
                    break

                case "category":
                    if (node.isExpand) {
                        gatherCategory(node.category.label, node.children)
                    }
                    break
            }
        })
        return expand

        function gatherCategory(label: MenuCategoryLabel, children: Menu) {
            const currentPath = [...path, label]
            expand.push(currentPath)
            gatherMenuExpand(children, currentPath).forEach((entry) => {
                expand.push(entry)
            })
        }
    }
    function toggleMenu(menu: Menu, path: MenuCategoryPath): Menu {
        if (path.length === 0) {
            return menu
        }
        return menu.map((node) => {
            if (node.type !== "category" || node.category.label !== path[0]) {
                return node
            }
            if (path.length === 1) {
                return { ...node, isExpand: !node.isExpand }
            }
            return {
                ...node,
                children: toggleMenu(node.children, path.slice(1)),
            }
        })
    }
}

const EMPTY_BADGE: MenuBadge = {}
const EMPTY_EXPAND: MenuExpand = []

const EMPTY_BREADCRUMB: Breadcrumb = []
const EMPTY_MENU: MenuNode[] = []
