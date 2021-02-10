import { MockComponent_legacy } from "../../../sub/getto-example/application/mock"

import {
    BreadcrumbListMockPasser,
    initMockBreadcrumbListComponent,
} from "../../../auth/Outline/breadcrumbList/mock"
import { initMockMenuListComponent, MenuListMockPasser } from "../../../auth/Outline/menuList/mock"
import { initMockSeasonInfoComponent } from "../../Outline/seasonInfo/mock"
import { initMockExampleComponent } from "../example/mock"

import { DashboardEntryPoint } from "./entryPoint"

import {
    initialSeasonInfoComponentState,
    SeasonInfoComponentState,
} from "../../Outline/seasonInfo/component"
import { ExampleComponentState, initialExampleComponentState } from "../example/component"

export type DashboardMockPasser = Readonly<{
    menuList: MenuListMockPasser
    breadcrumbList: BreadcrumbListMockPasser
}>
export function newMockDashboard(passer: DashboardMockPasser): DashboardMockEntryPoint {
    const resource = {
        seasonInfo: initMockSeasonInfoComponent(initialSeasonInfoComponentState),
        menuList: initMockMenuListComponent(passer.menuList),
        breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
        example: initMockExampleComponent(initialExampleComponentState),
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
            example: update(resource.example),
        },
    }
}

export type DashboardMockEntryPoint = Readonly<{
    dashboard: DashboardEntryPoint
    update: Readonly<{
        seasonInfo: Post<SeasonInfoComponentState>
        example: Post<ExampleComponentState>
    }>
}>

function update<S, C extends MockComponent_legacy<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
