import { ProfileResource } from "../entryPoint"

import { SeasonInfoComponentFactory } from "../../../../../example/x_components/Outline/seasonInfo/component"
import { MenuListComponentFactory } from "../../../Outline/menuList/component"
import { BreadcrumbListComponentFactory } from "../../../Outline/breadcrumbList/component"

import { LogoutComponentFactory } from "../../logout/component"

import { CredentialAction } from "../../../../common/credential/action"
import { MenuAction, MenuLocationInfo } from "../../../../permission/menu/action"
import { SeasonAction } from "../../../../../example/shared/season/action"
import { ErrorComponentFactory } from "../../../../../available/x_components/Error/error/component"
import { NotifyAction } from "../../../../../available/notify/action"

export type DashboardFactory = Readonly<{
    actions: Readonly<{
        notify: NotifyAction
        credential: CredentialAction
        menu: MenuAction
        season: SeasonAction
    }>
    components: Readonly<{
        error: ErrorComponentFactory
        seasonInfo: SeasonInfoComponentFactory
        menuList: MenuListComponentFactory
        breadcrumbList: BreadcrumbListComponentFactory

        example: LogoutComponentFactory
    }>
}>
export type DashboardLocationInfo = Readonly<{
    menu: MenuLocationInfo
}>
export function initDashboardResource(
    factory: DashboardFactory,
    locationInfo: DashboardLocationInfo
): ProfileResource {
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
