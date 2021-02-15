import { newMainMenuExpandRepository } from "../infra/repository/main"
import { newLoadMenuBadgeRemoteAccess } from "../infra/remote/menuBadge/main"

import { lnir } from "../../../../z_vendor/icon"

import { category, newMenuAction, item, newOutlineActionLocationInfo } from "./common"

import { initBreadcrumbListAction } from "../impl"

import { MenuPermission, MenuTree } from "../infra"

import { BreadcrumbListAction, MenuAction, OutlineAction } from "../action"

export function newMainOutlineAction(webStorage: Storage): OutlineAction {
    return {
        breadcrumbList: newMainBreadcrumbListAction(),
        menu: newMainMenuAction(webStorage),
    }
}

function newMainBreadcrumbListAction(): BreadcrumbListAction {
    return initBreadcrumbListAction(newOutlineActionLocationInfo(), { menuTree: mainMenuTree() })
}

function newMainMenuAction(webStorage: Storage): MenuAction {
    return newMenuAction(
        webStorage,
        newMainMenuExpandRepository,
        mainMenuTree(),
        newLoadMenuBadgeRemoteAccess()
    )
}

const any: MenuPermission = { type: "any" }

const mainMenuTree = (): MenuTree => [
    category("MAIN", any, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/document/index.html"),
    ]),
    category("SYSTEM", any, [item("プロフィール", lnir("user"), "/profile/index.html")]),
]
