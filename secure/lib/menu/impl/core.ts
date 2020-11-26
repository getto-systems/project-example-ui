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
    CategoryLabelsSet,
} from "../infra"

import { LoadBreadcrumb, LoadMenu, ToggleMenuExpand } from "../action"

import { ApiRoles, LoadResult } from "../../credential/data"
import {
    Breadcrumb,
    BreadcrumbNode,
    Menu,
    MenuCategory,
    markMenuCategory,
    MenuItem,
    markMenuItem,
    MenuNode,
    MenuTarget,
} from "../data"

export const loadBreadcrumb = (infra: LoadBreadcrumbInfra): LoadBreadcrumb => (collector) => async (
    post
) => {
    const { tree } = infra

    post({
        type: "succeed-to-load",
        breadcrumb: toBreadcrumb({
            tree,
            menuTarget: collector.getMenuTarget(),
        }),
    })
}

type BreadcrumbInfo = Readonly<{
    tree: MenuTree
    menuTarget: MenuTarget
}>

function toBreadcrumb({ tree, menuTarget }: BreadcrumbInfo): Breadcrumb {
    if (!menuTarget.versioned) {
        return []
    }
    const { version, currentPath } = menuTarget

    return treeToBreadcrumb(tree)

    function treeToBreadcrumb(tree: MenuTree): Breadcrumb {
        for (let i = 0; i < tree.length; i++) {
            const breadcrumb = breadcrumbNodes(tree[i])
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
        const breadcrumb = treeToBreadcrumb(children)
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

export const loadMenu = (infra: LoadMenuInfra): LoadMenu => (collector) => async (
    nonce,
    roles,
    post
) => {
    const { tree, expands, badge } = infra

    const info: MenuInfo = {
        tree,
        roles,
        menuTarget: collector.getMenuTarget(),
    }

    const expandResponse = expands.findExpand()
    if (!expandResponse.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, EMPTY_EXPAND, EMPTY_BADGE),
            err: expandResponse.err,
        })
        return
    }

    // badge の取得には時間がかかる可能性があるのでまず空 badge で返す
    // expand の取得には時間がかからないはずなので expand の取得前には返さない
    post({ type: "succeed-to-load", menu: toMenu(info, expandResponse.expand, EMPTY_BADGE) })

    if (!nonce.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, expandResponse.expand, EMPTY_BADGE),
            err: { type: "empty-nonce" },
        })
        return
    }

    const badgeResponse = await badge.getBadge(nonce.content)
    if (!badgeResponse.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, expandResponse.expand, EMPTY_BADGE),
            err: badgeResponse.err,
        })
        return
    }

    post({ type: "succeed-to-load", menu: toMenu(info, expandResponse.expand, badgeResponse.badge) })
}

type MenuInfo = Readonly<{
    tree: MenuTree
    roles: LoadResult<ApiRoles>
    menuTarget: MenuTarget
}>

function toMenu({ tree, menuTarget, roles }: MenuInfo, expand: MenuExpand, badge: MenuBadge): Menu {
    return treeToMenu(tree, [])

    function treeToMenu(tree: MenuTree, categoryLabels: string[]): Menu {
        return tree.flatMap((node) => menuNodes(node, categoryLabels))
    }
    function menuNodes(node: MenuTreeNode, categoryLabels: string[]): MenuNode[] {
        switch (node.type) {
            case "category":
                return menuCategory(node.category, node.children, [
                    ...categoryLabels,
                    node.category.label,
                ])
            case "item":
                return [menuItem(node.item)]
        }
    }
    function menuCategory(
        category: MenuTreeCategory,
        tree: MenuTree,
        categoryLabels: string[]
    ): MenuNode[] {
        if (!isAllow()) {
            return EMPTY_MENU
        }

        const children = treeToMenu(tree, categoryLabels)
        if (children.length === 0) {
            return EMPTY_MENU
        }

        const sumBadgeCount = children.reduce((acc, node) => acc + node.badgeCount, 0)

        return [
            {
                type: "category",
                isExpand: expand.hasEntry(categoryLabels) || children.some(hasActive),
                badgeCount: sumBadgeCount,
                category: toMenuCategory(category),
                children,
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
            badgeCount: badge[item.path] || 0,
            item: toMenuItem(item, menuTarget.version),
        }
    }
}

function toMenuCategory(category: MenuTreeCategory): MenuCategory {
    return markMenuCategory(category)
}
function toMenuItem({ label, icon, path }: MenuTreeItem, version: string): MenuItem {
    return markMenuItem({ label, icon, href: `/${version}${path}` })
}

export const toggleMenuExpand = (infra: ToggleMenuExpandInfra): ToggleMenuExpand => () => (
    category,
    menu,
    post
) => {
    const { expands } = infra

    const response = updateExpand()
    if (!response.success) {
        post({ type: "failed-to-toggle", menu: toggleMenu(category, menu), err: response.err })
        return
    }

    post({ type: "succeed-to-toggle", menu: toggleMenu(category, menu) })

    function updateExpand() {
        if (isExpand(category, menu)) {
            return expands.clearExpand(category)
        } else {
            return expands.setExpand(category)
        }
    }

    function isExpand(category: string[], menu: Menu): boolean {
        if (category.length === 0) {
            return false
        }
        for (let i = 0; i < menu.length; i++) {
            const node = menu[i]
            if (node.type === "category" && node.category.label === category[0]) {
                if (category.length === 1) {
                    return true
                } else {
                    return isExpand(category, node.children)
                }
            }
        }
        return false
    }
    function toggleMenu(category: string[], menu: Menu): Menu {
        if (category.length === 0) {
            return menu
        }
        return menu.map((node) => {
            if (node.type !== "category" || node.category.label !== category[0]) {
                return node
            }
            if (category.length === 0) {
                return { ...node, isExpand: !node.isExpand }
            }
            return {
                ...node,
                children: toggleMenu(category.slice(1), node.children),
            }
        })
    }
}

const EMPTY_EXPAND: MenuExpand = new CategoryLabelsSet()
const EMPTY_BADGE: MenuBadge = {}

const EMPTY_BREADCRUMB: Breadcrumb = []
const EMPTY_MENU: MenuNode[] = []
