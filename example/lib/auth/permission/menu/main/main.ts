import { newMainMenuExpandRepository } from "../infra/repository/main"
import { newLoadMenuBadgeRemoteAccess } from "../infra/remote/menuBadge/main"

import { lnir } from "../../../../z_vendor/icon"

import { category, newMenuActionPod, item } from "./common"

import { initBreadcrumbListActionPod } from "../impl"

import { MenuPermission, MenuTree } from "../infra"

import { BreadcrumbListActionPod, MenuActionPod } from "../action"

export function newMainBreadcrumbListActionPod(): BreadcrumbListActionPod {
    return initBreadcrumbListActionPod({ menuTree: mainMenuTree() })
}

export function newMainMenuActionPod(webStorage: Storage): MenuActionPod {
    return newMenuActionPod(
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
