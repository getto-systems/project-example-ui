import { detectMenuTarget } from "../../../../permission/menu/impl/location"

import { initBreadcrumbListComponent } from "../../breadcrumbList/impl"
import { initMenuListComponent } from "../../menuList/impl"

import { initTestCredentialAction } from "../../../../common/credential/tests/credential"
import { initTestMenuAction } from "../../../../permission/menu/tests/menu"

import { ApiCredentialRepository } from "../../../../common/credential/infra"
import {
    LoadMenuBadgeRemoteAccess,
    MenuExpandRepository,
    MenuTree,
} from "../../../../permission/menu/infra"

import { BreadcrumbListComponent } from "../../breadcrumbList/component"
import { MenuListComponent } from "../../menuList/component"

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
        credential: initTestCredentialAction(repository.apiCredentials),
        menu: initTestMenuAction(menuTree, repository.menuExpands, remote.loadMenuBadge),
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
            loadApiNonce: actions.credential.loadApiNonce(),
            loadApiRoles: actions.credential.loadApiRoles(),
            loadMenu: actions.menu.loadMenu(locationInfo.menu),
            toggleMenuExpand: actions.menu.toggleMenuExpand(),
        }),
    }
}
