import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"
import {
    initMockMenuComponent,
    MenuMockPropsPasser,
} from "../../../../common/x_Resource/Outline/Menu/Menu/mock"
import { initMockNotifyComponent } from "../../../../availability/x_Resource/NotifyError/Notify/mock"
import { initMockSeasonInfoComponent, SeasonInfoMockPropsPasser } from "../../Outline/seasonInfo/mock"
import { ExampleMockPropsPasser, initMockExampleComponent } from "../example/mock"

import { DashboardEntryPoint } from "./entryPoint"

export type DashboardMockPropsPasser = Readonly<{
    seasonInfo: SeasonInfoMockPropsPasser
    menu: MenuMockPropsPasser
    breadcrumbList: BreadcrumbListMockPropsPasser
    example: ExampleMockPropsPasser
}>
export function newMockDashboard(passer: DashboardMockPropsPasser): DashboardEntryPoint {
    return {
        resource: {
            error: initMockNotifyComponent(),
            seasonInfo: initMockSeasonInfoComponent(passer.seasonInfo),
            menu: initMockMenuComponent(passer.menu),
            breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
            example: initMockExampleComponent(passer.example),
        },
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
