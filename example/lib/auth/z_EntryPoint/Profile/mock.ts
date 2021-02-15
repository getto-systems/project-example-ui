import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"
import {
    initMockMenuComponent,
    MenuMockPropsPasser,
} from "../../../common/x_Resource/Outline/Menu/Menu/mock"
import {
    initMockSeasonInfoComponent,
    SeasonInfoMockPropsPasser,
} from "../../../example/x_components/Outline/seasonInfo/mock"
import {
    LogoutMockPropsPasser,
    initMockLogoutComponent,
} from "../../x_Resource/Sign/ClearCredential/Logout/mock"

import { ProfileEntryPoint } from "./entryPoint"
import { initMockErrorResource } from "../../../availability/x_Resource/Error/mock"

export type ProfileMockPropsPasser = Readonly<{
    seasonInfo: SeasonInfoMockPropsPasser
    menu: MenuMockPropsPasser
    breadcrumbList: BreadcrumbListMockPropsPasser
    logout: LogoutMockPropsPasser
}>
export function newMockDashboard(passer: ProfileMockPropsPasser): ProfileEntryPoint {
    return {
        resource: {
            ...initMockErrorResource(),
            seasonInfo: initMockSeasonInfoComponent(passer.seasonInfo),
            menu: initMockMenuComponent(passer.menu),
            breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
            logout: initMockLogoutComponent(passer.logout),
        },
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
