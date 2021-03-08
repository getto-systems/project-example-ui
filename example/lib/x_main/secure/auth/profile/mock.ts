import { initMockLogoutResource } from "../../../../auth/sign/kernel/authInfo/clear/Action/mock"
import { initMockNotifyUnexpectedErrorCoreAction } from "../../../../avail/unexpectedError/Action/Core/mock"
import { initNotifyUnexpectedErrorResource } from "../../../../avail/unexpectedError/Action/impl"
import {
    initMockLoadBreadcrumbListCoreAction,
    standard_MockBreadcrumbList,
} from "../../../../outline/menu/loadBreadcrumbList/Action/Core/mock"
import {
    initMockLoadMenuCoreAction,
    standard_MockMenu,
} from "../../../../outline/menu/loadMenu/Action/Core/mock"
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
