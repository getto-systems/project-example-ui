import {
    initSimulateMenuBadgeClient,
    MenuBadgeSimulator,
} from "../../../permission/menu/impl/remote/menuBadge/simulate"

import { detectMenuTarget } from "../impl/location"

import { initBreadcrumbListComponent } from "../../breadcrumbList/impl"
import { initMenuListComponent } from "../../menuList/impl"

import { loadApiNonce, loadApiRoles } from "../../../common/credential/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../permission/menu/impl/core"

import { ApiCredentialRepository } from "../../../common/credential/infra"
import { MenuExpandRepository, MenuTree } from "../../../permission/menu/infra"

import { BreadcrumbListComponent } from "../../breadcrumbList/component"
import { MenuListComponent } from "../../menuList/component"

import { CredentialAction } from "../../../common/credential/action"
import { MenuAction } from "../../../permission/menu/action"

export type MenuResource = Readonly<{
    breadcrumbList: BreadcrumbListComponent
    menuList: MenuListComponent
}>
export type MenuRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    menuExpands: MenuExpandRepository
}>
export type MenuSimulator = Readonly<{
    menuBadge: MenuBadgeSimulator
}>
export function newMenuResource(
    version: string,
    currentURL: URL,
    menuTree: MenuTree,
    repository: MenuRepository,
    simulator: MenuSimulator
): MenuResource {
    const actions = {
        credential: initCredentialAction(repository.apiCredentials),
        menu: initMenuAction(menuTree, repository.menuExpands, simulator.menuBadge),
    }
    const collector = {
        menu: {
            getMenuTarget: () => detectMenuTarget(version, currentURL),
        },
    }

    return {
        breadcrumbList: initBreadcrumbListComponent({
            loadBreadcrumb: actions.menu.loadBreadcrumb(collector.menu),
        }),
        menuList: initMenuListComponent({
            loadApiNonce: actions.credential.loadApiNonce(),
            loadApiRoles: actions.credential.loadApiRoles(),
            loadMenu: actions.menu.loadMenu(collector.menu),
            toggleMenuExpand: actions.menu.toggleMenuExpand(),
        }),
    }
}

export function initCredentialAction(apiCredentials: ApiCredentialRepository): CredentialAction {
    const infra = {
        apiCredentials,
    }

    return {
        loadApiNonce: loadApiNonce(infra),
        loadApiRoles: loadApiRoles(infra),
    }
}

export function initMenuAction(
    menuTree: MenuTree,
    menuExpands: MenuExpandRepository,
    simulator: MenuBadgeSimulator
): MenuAction {
    const infra = {
        menuTree,
        menuExpands,
        menuBadge: initSimulateMenuBadgeClient(simulator),
    }

    return {
        loadBreadcrumb: loadBreadcrumb(infra),
        loadMenu: loadMenu(infra),
        toggleMenuExpand: toggleMenuExpand(infra),
    }
}
