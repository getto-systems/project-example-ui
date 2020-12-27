import {
    initSimulateMenuBadgeClient,
    MenuBadgeSimulator,
} from "../../../shared/menu/impl/client/menuBadge/simulate"

import { initBreadcrumbListComponent } from "../../breadcrumbList/impl"
import { initMenuListComponent } from "../../menuList/impl"

import { loadSeason } from "../../../shared/season/impl/core"
import { loadApiNonce, loadApiRoles } from "../../../shared/credential/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../../shared/menu/impl/core"

import { Clock } from "../../../../z_infra/clock/infra"
import { ApiCredentialRepository } from "../../../shared/credential/infra"
import { SeasonRepository } from "../../../shared/season/infra"
import { MenuExpandRepository, MenuTree } from "../../../shared/menu/infra"

import { BreadcrumbListComponent } from "../../breadcrumbList/component"
import { MenuListComponent } from "../../menuList/component"

import { CredentialAction } from "../../../shared/credential/action"
import { MenuAction } from "../../../shared/menu/action"
import { SeasonAction } from "../../../shared/season/action"

import { MenuTarget } from "../../../shared/menu/data"

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
    menuTarget: MenuTarget,
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
            getMenuTarget: (): MenuTarget => menuTarget,
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

export function initSeasonAction(seasons: SeasonRepository, clock: Clock): SeasonAction {
    const infra = {
        seasons,
        clock,
    }

    return {
        loadSeason: loadSeason(infra),
    }
}
