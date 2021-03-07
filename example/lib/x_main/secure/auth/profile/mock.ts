import { initMockLogoutResource } from "../../../../auth/sign/kernel/authInfo/clear/Action/mock"
import { initMockNotifyUnexpectedErrorCoreAction } from "../../../../availability/unexpectedError/Action/Core/mock"
import { initNotifyUnexpectedErrorResource } from "../../../../availability/unexpectedError/Action/impl"
import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"
import {
    initMockMenuComponent,
    MenuMockPropsPasser,
} from "../../../../common/x_Resource/Outline/Menu/Menu/mock"
import {
    initMockSeasonInfoComponent,
    SeasonInfoMockPropsPasser,
} from "../../../../example/x_components/Outline/seasonInfo/mock"

import { AuthProfileResource } from "./entryPoint"

export type AuthProfileMockPropsPasser = Readonly<{
    seasonInfo: SeasonInfoMockPropsPasser
    menu: MenuMockPropsPasser
    breadcrumbList: BreadcrumbListMockPropsPasser
}>
export function initMockAuthProfileResource(
    passer: AuthProfileMockPropsPasser,
): AuthProfileResource {
    return {
        seasonInfo: initMockSeasonInfoComponent(passer.seasonInfo),
        menu: initMockMenuComponent(passer.menu),
        breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
        ...initNotifyUnexpectedErrorResource(initMockNotifyUnexpectedErrorCoreAction()),
        ...initMockLogoutResource(),
    }
}
