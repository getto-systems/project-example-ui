import { DashboardResource } from "../view"

import { SeasonInfoComponentFactory } from "../../../Outline/seasonInfo/component"
import { MenuListComponentFactory } from "../../../Outline/menuList/component"
import { BreadcrumbListComponentFactory } from "../../../Outline/breadcrumbList/component"

import { ExampleComponentFactory } from "../../example/component"

import { CredentialAction } from "../../../../auth/common/credential/action"
import { MenuAction, MenuTargetCollector } from "../../../shared/menu/action"
import { SeasonAction } from "../../../shared/season/action"

export type DashboardFactory = Readonly<{
    actions: Readonly<{
        credential: CredentialAction
        menu: MenuAction
        season: SeasonAction
    }>
    components: Readonly<{
        seasonInfo: SeasonInfoComponentFactory
        menuList: MenuListComponentFactory
        breadcrumbList: BreadcrumbListComponentFactory

        example: ExampleComponentFactory
    }>
}>
export type DashboardCollector = Readonly<{
    menu: MenuTargetCollector
}>
export function initDashboardResource(
    factory: DashboardFactory,
    collector: DashboardCollector
): DashboardResource {
    const actions = {
        loadApiNonce: factory.actions.credential.loadApiNonce(),
        loadApiRoles: factory.actions.credential.loadApiRoles(),

        loadSeason: factory.actions.season.loadSeason(),

        loadBreadcrumb: factory.actions.menu.loadBreadcrumb(collector.menu),
        loadMenu: factory.actions.menu.loadMenu(collector.menu),
        toggleMenuExpand: factory.actions.menu.toggleMenuExpand(),
    }
    return {
        seasonInfo: factory.components.seasonInfo(actions),
        menuList: factory.components.menuList(actions),
        breadcrumbList: factory.components.breadcrumbList(actions),

        example: factory.components.example(actions),
    }
}
