import { detectMenuTarget } from "../../../../permission/menu/impl/location"

import { initBreadcrumbListComponent } from "../../breadcrumbList/impl"
import { initMenuListComponent } from "../../menuList/impl"

import { initTestMenuAction } from "../../../../permission/menu/tests/menu"

import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../permission/menu/infra"

import { BreadcrumbListComponent } from "../../breadcrumbList/component"
import { MenuListComponent } from "../../menuList/component"
import { ApiCredentialRepository } from "../../../../../common/auth/apiCredential/infra"

export type MenuTestResource = Readonly<{
    breadcrumbList: BreadcrumbListComponent
    menuList: MenuListComponent
}>
export type MenuTestRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    menuExpands: MenuExpandRepository
}>
export type MenuTestRemoteAccess = Readonly<{
    loadMenuBadge: LoadMenuBadgeRemoteAccess
}>
export function newTestMenuResource(
    version: string,
    currentURL: URL,
    menuTree: MenuTree,
    repository: MenuTestRepository,
    remote: MenuTestRemoteAccess
): MenuTestResource {
    const actions = {
        menu: initTestMenuAction(
            repository.apiCredentials,
            menuTree,
            repository.menuExpands,
            remote.loadMenuBadge
        ),
    }
    const locationInfo = {
        menu: {
            getMenuTarget: () => detectMenuTarget(version, currentURL),
        },
    }

    return {
        breadcrumbList: initBreadcrumbListComponent({
            loadBreadcrumb: actions.menu.loadBreadcrumb(locationInfo.menu),
        }),
        menuList: initMenuListComponent({
            loadMenu: actions.menu.loadMenu(locationInfo.menu),
            toggleMenuExpand: actions.menu.toggleMenuExpand(),
        }),
    }
}
