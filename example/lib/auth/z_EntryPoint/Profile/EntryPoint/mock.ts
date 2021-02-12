import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../../Outline/breadcrumbList/mock"
import {
    initMockMenuListComponent,
    MenuListMockPropsPasser,
} from "../../Outline/menuList/mock"
import { initMockErrorComponent } from "../../../../available/x_components/Error/error/mock"
import { initMockSeasonInfoComponent, SeasonInfoMockPropsPasser } from "../../../../example/x_components/Outline/seasonInfo/mock"
import { LogoutMockPropsPasser, initMockLogoutComponent } from "../logout/mock"

import { ProfileEntryPoint } from "./entryPoint"

export type DashboardMockPropsPasser = Readonly<{
    seasonInfo: SeasonInfoMockPropsPasser
    menuList: MenuListMockPropsPasser
    breadcrumbList: BreadcrumbListMockPropsPasser
    logout: LogoutMockPropsPasser
}>
export function newMockDashboard(passer: DashboardMockPropsPasser): ProfileEntryPoint {
    return {
        resource: {
            error: initMockErrorComponent(),
            seasonInfo: initMockSeasonInfoComponent(passer.seasonInfo),
            menuList: initMockMenuListComponent(passer.menuList),
            breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
            logout: initMockLogoutComponent(passer.logout),
        },
        terminate: () => {
            // mock では特に何もしない
        },
    }
}