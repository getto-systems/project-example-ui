import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../Outline/breadcrumbList/mock"
import {
    initMockMenuListComponent,
    MenuListMockPropsPasser,
} from "../Outline/menuList/mock"
import { initMockNotifyComponent } from "../../../availability/x_Resource/NotifyError/Notify/mock"
import { initMockSeasonInfoComponent, SeasonInfoMockPropsPasser } from "../../../example/x_components/Outline/seasonInfo/mock"
import { LogoutMockPropsPasser, initMockLogoutComponent } from "../../x_Resource/Sign/ClearCredential/Logout/mock"

import { ProfileEntryPoint } from "./entryPoint"

export type ProfileMockPropsPasser = Readonly<{
    seasonInfo: SeasonInfoMockPropsPasser
    menuList: MenuListMockPropsPasser
    breadcrumbList: BreadcrumbListMockPropsPasser
    logout: LogoutMockPropsPasser
}>
export function newMockDashboard(passer: ProfileMockPropsPasser): ProfileEntryPoint {
    return {
        resource: {
            error: initMockNotifyComponent(),
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
