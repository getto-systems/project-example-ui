import { newMainOutlineMenuExpandRepository } from "../infra/repository/outlineMenuExpand/main"
import { newLoadOutlineMenuBadgeRemoteAccess } from "../infra/remote/loadOutlineMenuBadge/main"

import { lnir } from "../../../../../z_vendor/icon/core"

import { category, newOutlineMenuAction, item, newOutlineBreadcrumbListAction } from "./common"

import { OutlineMenuPermission, OutlineMenuTree } from "../infra"

import { LoadOutlineAction } from "../action"

export function newMainOutlineAction(webStorage: Storage): LoadOutlineAction {
    const menuTree = mainMenuTree()
    return {
        breadcrumbList: newOutlineBreadcrumbListAction(menuTree),
        menu: newOutlineMenuAction(
            webStorage,
            newMainOutlineMenuExpandRepository,
            menuTree,
            newLoadOutlineMenuBadgeRemoteAccess()
        ),
    }
}

const allow: OutlineMenuPermission = { type: "allow" }

const mainMenuTree = (): OutlineMenuTree => [
    category("MAIN", allow, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/document/index.html"),
    ]),
    category("SYSTEM", allow, [item("プロフィール", lnir("user"), "/auth/profile.html")]),
]
