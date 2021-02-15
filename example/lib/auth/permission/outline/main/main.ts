import { newMainOutlineMenuExpandRepository } from "../infra/repository/outlineMenuExpand/main"
import { newLoadOutlineMenuBadgeRemoteAccess } from "../infra/remote/loadOutlineMenuBadge/main"

import { lnir } from "../../../../z_vendor/icon"

import { category, newOutlineMenuAction, item, newOutlineBreadcrumbListAction } from "./common"

import { OutlineMenuPermission, OutlineMenuTree } from "../infra"

import { OutlineAction } from "../action"

export function newMainOutlineAction(webStorage: Storage): OutlineAction {
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

const any: OutlineMenuPermission = { type: "any" }

const mainMenuTree = (): OutlineMenuTree => [
    category("MAIN", any, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/document/index.html"),
    ]),
    category("SYSTEM", any, [item("プロフィール", lnir("user"), "/profile/index.html")]),
]
