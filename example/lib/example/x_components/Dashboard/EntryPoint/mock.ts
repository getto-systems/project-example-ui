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
