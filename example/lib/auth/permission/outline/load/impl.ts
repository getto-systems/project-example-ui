import { LoadApiCredentialResult } from "../../../../common/apiCredential/infra"
import {
    OutlineMenuBadge,
    OutlineMenuExpand,
    OutlineMenuTree,
    OutlineMenuTreeNode,
    OutlineMenuTreeCategory,
    OutlineMenuTreeItem,
    OutlineMenuCategoryPathSet,
    OutlineMenuActionInfra,
    LoadOutlineBreadcrumbList,
    LoadOutlineMenu,
    ToggleOutlineMenuExpand,
    OutlineBreadcrumbListActionInfra,
    OutlineMenuPermission,
    OutlineMenuBadgeItem,
} from "./infra"

import {
    LoadOutlineBreadcrumbListAction,
    LoadOutlineMenuAction,
    LoadOutlineActionLocationInfo,
} from "./action"

import { ApiRoles, emptyApiRoles } from "../../../../common/apiCredential/data"
import {
    OutlineBreadcrumb,
    OutlineBreadcrumbNode,
    OutlineMenu,
    OutlineMenuCategory,
    OutlineMenuItem,
    markOutlineMenuItem,
    OutlineMenuNode,
    OutlineMenuTarget,
    OutlineMenuCategoryPath,
    markOutlineMenuCategoryLabel,
    OutlineMenuCategoryLabel,
    markOutlineMenuTarget,
    LoadOutlineMenuBadgeError,
    LoadOutlineMenuBadgeRemoteError,
} from "./data"
import { unwrapRemoteError } from "../../../../z_vendor/getto-application/infra/remote/helper"

export function initOutlineActionLocationInfo(
    version: string,
    currentURL: URL,
): LoadOutlineActionLocationInfo {
    return {
        getOutlineMenuTarget: () => detectMenuTarget(version, currentURL),
    }
}

function detectMenuTarget(version: string, currentURL: URL): OutlineMenuTarget {
    const pathname = currentURL.pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return markOutlineMenuTarget({ versioned: false, version })
    }
    return markOutlineMenuTarget({
        versioned: true,
        version,
        currentPath: pathname.replace(versionPrefix, "/"),
    })
}

export function initOutlineBreadcrumbListAction(
    locationInfo: LoadOutlineActionLocationInfo,
    infra: OutlineBreadcrumbListActionInfra,
): LoadOutlineBreadcrumbListAction {
    return {
        loadBreadcrumbList: loadBreadcrumbList(infra)(locationInfo),
    }
}

export function initOutlineMenuAction(
    locationInfo: LoadOutlineActionLocationInfo,
    infra: OutlineMenuActionInfra,
): LoadOutlineMenuAction {
    return {
        loadMenu: loadMenu(infra)(locationInfo),
        toggleMenuExpand: toggleMenuExpand(infra),
    }
}

const loadBreadcrumbList: LoadOutlineBreadcrumbList = (infra) => (locationInfo) => async (post) => {
    const target = locationInfo.getOutlineMenuTarget()
    if (!target.versioned) {
        post({ type: "succeed-to-load", breadcrumb: EMPTY_BREADCRUMB })
        return
    }

    post({ type: "succeed-to-load", breadcrumb: buildBreadcrumb(target) })

    type TargetInfo = Readonly<{
        version: string
        currentPath: string
    }>
    function buildBreadcrumb({ version, currentPath }: TargetInfo): OutlineBreadcrumb {
        const { menuTree } = infra

        return toBreadcrumb(menuTree)

        function toBreadcrumb(menuTree: OutlineMenuTree): OutlineBreadcrumb {
            for (let i = 0; i < menuTree.length; i++) {
                const breadcrumb = nodes(menuTree[i])
                if (breadcrumb.length > 0) {
                    return breadcrumb
                }
            }
            return EMPTY_BREADCRUMB
        }
        function nodes(node: OutlineMenuTreeNode): OutlineBreadcrumbNode[] {
            switch (node.type) {
                case "category":
                    return categoryNode(node.category, node.children)
                case "item":
                    return itemNode(node.item)
            }
        }
        function categoryNode(
            category: OutlineMenuTreeCategory,
            children: OutlineMenuTree,
        ): OutlineBreadcrumbNode[] {
            const breadcrumb = toBreadcrumb(children)
            if (breadcrumb.length === 0) {
                return EMPTY_BREADCRUMB
            }
            return [{ type: "category", category: toOutlineMenuCategory(category) }, ...breadcrumb]
        }
        function itemNode(item: OutlineMenuTreeItem): OutlineBreadcrumbNode[] {
            if (item.path !== currentPath) {
                return EMPTY_BREADCRUMB
            }
            return [{ type: "item", item: toOutlineMenuItem(item, version) }]
        }
    }
}

const loadMenu: LoadOutlineMenu = (infra) => (locationInfo) => async (post) => {
    const { apiCredentials, menuExpands, loadMenuBadge } = infra

    const apiCredentialLoadResult = apiCredentials.load()
    const apiRoles = toApiRoles(apiCredentialLoadResult)

    const menuExpandResponse = menuExpands.load()
    if (!menuExpandResponse.success) {
        failed(apiRoles, EMPTY_EXPAND, menuExpandResponse.err)
        return
    }

    const menuExpand = menuExpandResponse.menuExpand

    // badge の取得には時間がかかる可能性があるのでまず空 badge で返す
    // expand の取得には時間がかからないはずなので expand の取得前には返さない
    post({
        type: "succeed-to-instant-load",
        menu: buildMenu(apiRoles, menuExpand, EMPTY_BADGE),
    })

    if (!apiCredentialLoadResult.success) {
        failed(apiRoles, menuExpand, apiCredentialLoadResult.err)
        return
    }
    if (!apiCredentialLoadResult.found) {
        failed(apiRoles, menuExpand, { type: "empty-nonce" })
        return
    }

    const menuBadgeResponse = await unwrapRemoteError(
        loadMenuBadge(apiCredentialLoadResult.apiCredential.apiNonce),
        infraError,
    )
    if (!menuBadgeResponse.success) {
        failed(apiRoles, menuExpand, menuBadgeResponse.err)
        return
    }

    post({
        type: "succeed-to-load",
        menu: buildMenu(apiRoles, menuExpand, toMenuBadge(menuBadgeResponse.value)),
    })

    function toApiRoles(result: LoadApiCredentialResult) {
        if (result.success && result.found) {
            return result.apiCredential.apiRoles
        }
        return emptyApiRoles()
    }
    function toMenuBadge(items: OutlineMenuBadgeItem[]): OutlineMenuBadge {
        return items.reduce((acc, item) => {
            acc[item.path] = item.count
            return acc
        }, <OutlineMenuBadge>{})
    }

    function failed(
        permittedRoles: ApiRoles,
        menuExpand: OutlineMenuExpand,
        err: LoadOutlineMenuBadgeError,
    ): void {
        post({
            type: "failed-to-load",
            menu: buildMenu(permittedRoles, menuExpand, EMPTY_BADGE),
            err,
        })
    }
    function infraError(err: unknown): LoadOutlineMenuBadgeRemoteError {
        return { type: "infra-error", err: `${err}` }
    }

    function buildMenu(
        permittedRoles: ApiRoles,
        menuExpand: OutlineMenuExpand,
        menuBadge: OutlineMenuBadge,
    ): OutlineMenu {
        const { menuTree } = infra
        const menuTarget = locationInfo.getOutlineMenuTarget()

        const menuExpandSet = new OutlineMenuCategoryPathSet()
        menuExpandSet.init(menuExpand)

        return toMenu(menuTree, [])

        function toMenu(
            menuTree: OutlineMenuTree,
            categoryPath: OutlineMenuCategoryPath,
        ): OutlineMenu {
            return menuTree.flatMap((node) => nodes(node, categoryPath))
        }
        function nodes(
            node: OutlineMenuTreeNode,
            categoryPath: OutlineMenuCategoryPath,
        ): OutlineMenuNode[] {
            switch (node.type) {
                case "category":
                    return categoryNode(node.category, node.children, [
                        ...categoryPath,
                        markOutlineMenuCategoryLabel(node.category.label),
                    ])
                case "item":
                    return [itemNode(node.item)]
            }
        }
        function categoryNode(
            category: OutlineMenuTreeCategory,
            menuTree: OutlineMenuTree,
            path: OutlineMenuCategoryPath,
        ): OutlineMenuNode[] {
            if (!isAllow(category.permission)) {
                return EMPTY_MENU
            }

            const children = toMenu(menuTree, path)
            if (children.length === 0) {
                return EMPTY_MENU
            }

            const sumBadgeCount = children.reduce((acc, node) => acc + node.badgeCount, 0)

            return [
                {
                    type: "category",
                    isExpand: menuExpandSet.hasEntry(path) || children.some(hasActive),
                    badgeCount: sumBadgeCount,
                    category: toOutlineMenuCategory(category),
                    children,
                    path,
                },
            ]

            function isAllow(permission: OutlineMenuPermission): boolean {
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
            function hasActive(node: OutlineMenuNode): boolean {
                switch (node.type) {
                    case "category":
                        return node.children.some(hasActive)
                    case "item":
                        return node.isActive
                }
            }
        }
        function itemNode(item: OutlineMenuTreeItem): OutlineMenuNode {
            return {
                type: "item",
                isActive: menuTarget.versioned ? item.path === menuTarget.currentPath : false,
                badgeCount: menuBadge[item.path] || 0,
                item: toOutlineMenuItem(item, menuTarget.version),
            }
        }
    }
}

function toOutlineMenuCategory(category: OutlineMenuTreeCategory): OutlineMenuCategory {
    return {
        label: markOutlineMenuCategoryLabel(category.label),
    }
}
function toOutlineMenuItem(
    { label, icon, path }: OutlineMenuTreeItem,
    version: string,
): OutlineMenuItem {
    return markOutlineMenuItem({ label, icon, href: `/${version}${path}` })
}

const toggleMenuExpand: ToggleOutlineMenuExpand = (infra) => (menu, path, post) => {
    const { menuExpands } = infra

    const updatedMenu = toggleMenu(menu, path)

    const response = menuExpands.store(gatherMenuExpand(updatedMenu, []))
    if (!response.success) {
        post({ type: "failed-to-toggle", menu: updatedMenu, err: response.err })
        return
    }

    post({ type: "succeed-to-toggle", menu: updatedMenu })

    function gatherMenuExpand(
        target: OutlineMenu,
        path: OutlineMenuCategoryPath,
    ): OutlineMenuExpand {
        const expand: OutlineMenuExpand = []
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

        function gatherCategory(label: OutlineMenuCategoryLabel, children: OutlineMenu) {
            const currentPath = [...path, label]
            expand.push(currentPath)
            gatherMenuExpand(children, currentPath).forEach((entry) => {
                expand.push(entry)
            })
        }
    }
    function toggleMenu(menu: OutlineMenu, path: OutlineMenuCategoryPath): OutlineMenu {
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

const EMPTY_BADGE: OutlineMenuBadge = {}
const EMPTY_EXPAND: OutlineMenuExpand = []

const EMPTY_BREADCRUMB: OutlineBreadcrumb = []
const EMPTY_MENU: OutlineMenuNode[] = []
