import { DashboardResource } from "../view"

import { SeasonComponentFactory } from "../../../shared/Outline/season/component"
import { MenuComponentFactory } from "../../../shared/Outline/menu/component"
import { BreadcrumbComponentFactory } from "../../../shared/Outline/breadcrumb/component"

import { ExampleComponentFactory } from "../../example/component"

import { LoadApiNonce, LoadApiRoles } from "../../../shared/credential/action"
import { LoadBreadcrumb, LoadMenu, MenuTargetCollector, ToggleMenuExpand } from "../../../shared/menu/action"
import { LoadSeason } from "../../../shared/season/action"

export type DashboardFactory = Readonly<{
    actions: Readonly<{
        credential: Readonly<{
            loadApiNonce: LoadApiNonce
            loadApiRoles: LoadApiRoles
        }>
        menu: Readonly<{
            loadBreadcrumb: LoadBreadcrumb
            loadMenu: LoadMenu
            toggleMenuExpand: ToggleMenuExpand
        }>
        season: Readonly<{
            loadSeason: LoadSeason
        }>
    }>
    components: Readonly<{
        season: SeasonComponentFactory
        menu: MenuComponentFactory
        breadcrumb: BreadcrumbComponentFactory

        example: ExampleComponentFactory
    }>
}>
export type DashboardCollectorSet = Readonly<{
    menu: MenuTargetCollector
}>
export function initDashboardComponent(
    factory: DashboardFactory,
    collector: DashboardCollectorSet
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
