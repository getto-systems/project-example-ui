import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../../../../auth/z_EntryPoint/Outline/breadcrumbList/mock"
import {
    initMockMenuListComponent,
    MenuListMockPropsPasser,
} from "../../../../auth/z_EntryPoint/Outline/menuList/mock"
import { initMockErrorComponent } from "../../../../availability/x_Resource/Error/error/mock"
import { initMockSeasonInfoComponent, SeasonInfoMockPropsPasser } from "../../Outline/seasonInfo/mock"
import { ExampleMockPropsPasser, initMockExampleComponent } from "../example/mock"

import { DashboardEntryPoint } from "./entryPoint"

export type DashboardMockPropsPasser = Readonly<{
    seasonInfo: SeasonInfoMockPropsPasser
    menuList: MenuListMockPropsPasser
    breadcrumbList: BreadcrumbListMockPropsPasser
    example: ExampleMockPropsPasser
}>
export function newMockDashboard(passer: DashboardMockPropsPasser): DashboardEntryPoint {
    return {
        resource: {
            error: initMockErrorComponent(),
            seasonInfo: initMockSeasonInfoComponent(passer.seasonInfo),
            menuList: initMockMenuListComponent(passer.menuList),
            breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
            example: initMockExampleComponent(passer.example),
        },
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
