import { initMockLogoutResource } from "../../../../auth/sign/kernel/auth_info/action_logout/mock"
import { initMockNotifyUnexpectedErrorCoreAction } from "../../../../avail/action_unexpected_error/core/mock"
import { initNotifyUnexpectedErrorResource } from "../../../../avail/action_unexpected_error/impl"
import {
    initMockLoadBreadcrumbListCoreAction,
    standard_MockBreadcrumbList,
} from "../../../../outline/menu/action_load_breadcrumb_list/core/mock"
import {
    initMockLoadMenuCoreAction,
    standard_MockMenu,
} from "../../../../outline/menu/action_load_menu/core/mock"
import {
    initMockSeasonInfoComponent,
    SeasonInfoMockPropsPasser,
} from "../../../../example/x_components/Outline/seasonInfo/mock"

import { AuthProfileResource } from "./entryPoint"

export type AuthProfileMockPropsPasser = Readonly<{
    seasonInfo: SeasonInfoMockPropsPasser
}>
export function initMockAuthProfileResource(
    passer: AuthProfileMockPropsPasser,
): AuthProfileResource {
    return {
        seasonInfo: initMockSeasonInfoComponent(passer.seasonInfo),
        menu: initMockLoadMenuCoreAction(standard_MockMenu()),
        breadcrumbList: initMockLoadBreadcrumbListCoreAction(standard_MockBreadcrumbList()),
        ...initNotifyUnexpectedErrorResource(initMockNotifyUnexpectedErrorCoreAction()),
        ...initMockLogoutResource(),
    }
}
