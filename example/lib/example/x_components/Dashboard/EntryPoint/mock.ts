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
} from "../../Outline/seasonInfo/mock"
import { ExampleMockPropsPasser, initMockExampleComponent } from "../example/mock"

import { DashboardEntryPoint } from "./entryPoint"

export type DashboardMockPropsPasser = Readonly<{
    seasonInfo: SeasonInfoMockPropsPasser
    example: ExampleMockPropsPasser
}>
export function newMockDashboard(passer: DashboardMockPropsPasser): DashboardEntryPoint {
    return {
        resource: {
            ...initNotifyUnexpectedErrorResource(initMockNotifyUnexpectedErrorCoreAction()),
            seasonInfo: initMockSeasonInfoComponent(passer.seasonInfo),
            menu: initMockLoadMenuCoreAction(standard_MockMenu()),
            breadcrumbList: initMockLoadBreadcrumbListCoreAction(standard_MockBreadcrumbList()),
            example: initMockExampleComponent(passer.example),
        },
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
