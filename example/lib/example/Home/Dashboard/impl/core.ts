import { DashboardResource } from "../view"

import { SeasonInfoComponentFactory } from "../../../Outline/seasonInfo/component"
import { MenuListComponentFactory } from "../../../Outline/menuList/component"
import { BreadcrumbListComponentFactory } from "../../../Outline/breadcrumbList/component"

import { ExampleComponentFactory } from "../../example/component"

import { CredentialAction } from "../../../shared/credential/action"
import { MenuAction, MenuTargetCollector } from "../../../shared/menu/action"
import { SeasonAction } from "../../../shared/season/action"

export type DashboardFactory = Readonly<{
    actions: Readonly<{
        credential: CredentialAction
        menu: MenuAction
        season: SeasonAction
    }>
    components: Readonly<{
        season: SeasonInfoComponentFactory
        menu: MenuListComponentFactory
        breadcrumb: BreadcrumbListComponentFactory

        example: ExampleComponentFactory
    }>
}>
export type DashboardCollector = Readonly<{
    menu: MenuTargetCollector
}>
export function initDashboardComponent(
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
        season: factory.components.season(actions),
        menu: factory.components.menu(actions),
        breadcrumb: factory.components.breadcrumb(actions),

        example: factory.components.example(actions),
    }
}
