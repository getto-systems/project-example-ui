import { initMockLogoutAction } from "../../../../auth/sign/kernel/authnInfo/clear/x_Action/Logout/mock"
import { initMockErrorResource } from "../../../../availability/x_Resource/Error/mock"
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
        ...initMockErrorResource(),
        logout: initMockLogoutAction(),
        seasonInfo: initMockSeasonInfoComponent(passer.seasonInfo),
        menu: initMockMenuComponent(passer.menu),
        breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
    }
}
