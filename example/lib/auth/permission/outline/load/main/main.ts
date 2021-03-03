import { env } from "../../../../../y_environment/env"
import { newLoadOutlineMenuBadgeRemote } from "../infra/remote/loadMenuBadge/main"
import { newOutlineMenuExpandRepository } from "../infra/repository/menuExpand"

import { lnir } from "../../../../../z_external/icon/core"

import { category, newOutlineMenuAction, item, newOutlineBreadcrumbListAction } from "./common"

import { OutlineMenuPermission, OutlineMenuTree } from "../infra"

import { LoadOutlineAction } from "../action"

export function newMainOutlineAction(webStorage: Storage, currentURL: URL): LoadOutlineAction {
    const menuTree = mainMenuTree()
    return {
        breadcrumbList: newOutlineBreadcrumbListAction(currentURL, menuTree),
        menu: newOutlineMenuAction(
            webStorage,
            currentURL,
            newOutlineMenuExpandRepository(webStorage, env.storageKey.menuExpand.main),
            menuTree,
            newLoadOutlineMenuBadgeRemote(),
        ),
    }
}

const allow: OutlineMenuPermission = { type: "allow" }

const mainMenuTree = (): OutlineMenuTree => [
    category("MAIN", allow, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/docs/index.html"),
    ]),
    category("SYSTEM", allow, [item("プロフィール", lnir("user"), "/auth/profile.html")]),
]
