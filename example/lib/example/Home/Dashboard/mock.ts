import { MockComponent_legacy } from "../../../sub/getto-example/application/mock"

import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../../../auth/Outline/breadcrumbList/mock"
import { initMockMenuListComponent, MenuListMockPropsPasser } from "../../../auth/Outline/menuList/mock"
import { initMockSeasonInfoComponent } from "../../Outline/seasonInfo/mock"
import { ExampleMockPropsPasser, initMockExampleComponent } from "../example/mock"

import { DashboardEntryPoint } from "./entryPoint"

import {
    initialSeasonInfoComponentState,
    SeasonInfoComponentState,
} from "../../Outline/seasonInfo/component"

export type DashboardMockPropsPasser = Readonly<{
    menuList: MenuListMockPropsPasser
    breadcrumbList: BreadcrumbListMockPropsPasser
    example: ExampleMockPropsPasser
}>
export function newMockDashboard(passer: DashboardMockPropsPasser): DashboardMockEntryPoint {
    const resource = {
        seasonInfo: initMockSeasonInfoComponent(initialSeasonInfoComponentState),
        menuList: initMockMenuListComponent(passer.menuList),
        breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
        example: initMockExampleComponent(passer.example),
    }
    return {
        dashboard: {
            resource,
            terminate: () => {
                // mock では特に何もしない
            },
        },
        update: {
            seasonInfo: update(resource.seasonInfo),
        },
    }
}

export type DashboardMockEntryPoint = Readonly<{
    dashboard: DashboardEntryPoint
    update: Readonly<{
        seasonInfo: Post<SeasonInfoComponentState>
    }>
}>

function update<S, C extends MockComponent_legacy<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
