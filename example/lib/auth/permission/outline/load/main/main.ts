import { newMainOutlineMenuExpandRepository } from "../infra/repository/outlineMenuExpand/main"
import { newLoadOutlineMenuBadgeRemote } from "../infra/remote/loadMenuBadge/main"

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
            newMainOutlineMenuExpandRepository,
            menuTree,
            newLoadOutlineMenuBadgeRemote()
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
