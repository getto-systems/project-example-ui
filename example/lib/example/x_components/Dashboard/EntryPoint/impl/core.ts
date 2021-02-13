import { DashboardResource } from "../entryPoint"

import { SeasonInfoComponentFactory } from "../../../Outline/seasonInfo/component"
import { MenuListComponentFactory } from "../../../../../auth/z_EntryPoint/Outline/menuList/component"
import { BreadcrumbListComponentFactory } from "../../../../../auth/z_EntryPoint/Outline/breadcrumbList/component"

import { ExampleComponentFactory } from "../../example/component"

import { CredentialAction } from "../../../../../auth/common/credential/action"
import { MenuAction, MenuLocationInfo } from "../../../../../auth/permission/menu/action"
import { SeasonAction } from "../../../../shared/season/action"
import { NotifyComponentFactory } from "../../../../../availability/x_Resource/NotifyError/Notify/component"
import { NotifyAction } from "../../../../../availability/notify/action"

export type DashboardFactory = Readonly<{
    actions: Readonly<{
        notify: NotifyAction
        credential: CredentialAction
        menu: MenuAction
        season: SeasonAction
    }>
    components: Readonly<{
        error: NotifyComponentFactory
        seasonInfo: SeasonInfoComponentFactory
        menuList: MenuListComponentFactory
        breadcrumbList: BreadcrumbListComponentFactory

        example: ExampleComponentFactory
    }>
}>
export type DashboardLocationInfo = Readonly<{
    menu: MenuLocationInfo
}>
export function initDashboardResource(
    factory: DashboardFactory,
    locationInfo: DashboardLocationInfo
): DashboardResource {
    const actions = {
        notify: factory.actions.notify.notify(),

        loadApiNonce: factory.actions.credential.loadApiNonce(),
        loadApiRoles: factory.actions.credential.loadApiRoles(),

        loadSeason: factory.actions.season.loadSeason(),

        loadBreadcrumb: factory.actions.menu.loadBreadcrumb(locationInfo.menu),
        loadMenu: factory.actions.menu.loadMenu(locationInfo.menu),
        toggleMenuExpand: factory.actions.menu.toggleMenuExpand(),
    }
    return {
        error: factory.components.error(actions),
        seasonInfo: factory.components.seasonInfo(actions),
        menuList: factory.components.menuList(actions),
        breadcrumbList: factory.components.breadcrumbList(actions),

        example: factory.components.example(actions),
    }
}
