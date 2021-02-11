import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../../../../auth/x_components/Outline/breadcrumbList/mock"
import {
    initMockMenuListComponent,
    MenuListMockPropsPasser,
} from "../../../../auth/x_components/Outline/menuList/mock"
import { initMockErrorComponent } from "../../../../available/x_components/Error/error/mock"
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
