import { detectMenuTarget } from "../impl/location"

import { initBreadcrumbListComponent } from "../../breadcrumbList/impl"
import { initMenuListComponent } from "../../menuList/impl"

import { loadApiNonce, loadApiRoles } from "../../../../common/credential/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../../permission/menu/impl/core"

import { ApiCredentialRepository } from "../../../../common/credential/infra"
import {
    LoadBreadcrumbInfra,
    LoadMenuBadgeRemoteAccess,
    LoadMenuInfra,
    MenuExpandRepository,
    MenuTree,
    ToggleMenuExpandInfra,
} from "../../../../permission/menu/infra"

import { BreadcrumbListComponent } from "../../breadcrumbList/component"
import { MenuListComponent } from "../../menuList/component"

import { CredentialAction } from "../../../../common/credential/action"
import { MenuAction } from "../../../../permission/menu/action"

export type MenuResource = Readonly<{
    breadcrumbList: BreadcrumbListComponent
    menuList: MenuListComponent
}>
export type MenuRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    menuExpands: MenuExpandRepository
}>
export type MenuRemoteAccess = Readonly<{
    loadMenuBadge: LoadMenuBadgeRemoteAccess
}>
export function newTestMenuResource(
    version: string,
    currentURL: URL,
    menuTree: MenuTree,
    repository: MenuRepository,
    remote: MenuRemoteAccess
): MenuResource {
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

export function initTestCredentialAction(apiCredentials: ApiCredentialRepository): CredentialAction {
    const infra = {
        apiCredentials,
    }

    return {
        loadApiNonce: loadApiNonce(infra),
        loadApiRoles: loadApiRoles(infra),
    }
}

export function initTestMenuAction(
    menuTree: MenuTree,
    menuExpands: MenuExpandRepository,
    remote: LoadMenuBadgeRemoteAccess
): MenuAction {
    return {
        loadBreadcrumb: loadBreadcrumb(loadBreadcrumbInfra()),
        loadMenu: loadMenu(loadMenuInfra()),
        toggleMenuExpand: toggleMenuExpand(toggleMenuExpandInfra()),
    }

    function loadBreadcrumbInfra(): LoadBreadcrumbInfra {
        return {
            menuTree,
        }
    }
    function loadMenuInfra(): LoadMenuInfra {
        return {
            menuTree,
            menuExpands,
            loadMenuBadge: remote,
        }
    }
    function toggleMenuExpandInfra(): ToggleMenuExpandInfra {
        return {
            menuExpands,
        }
    }
}
