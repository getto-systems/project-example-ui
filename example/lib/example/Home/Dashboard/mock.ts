import { MockComponent } from "../../../sub/getto-example/application/mock"

import { initMockBreadcrumbListComponent } from "../../../auth/Outline/breadcrumbList/mock"
import { initMockMenuListComponent } from "../../../auth/Outline/menuList/mock"
import { initMockSeasonInfoComponent } from "../../Outline/seasonInfo/mock"
import { initMockExampleComponent } from "../example/mock"

import { DashboardEntryPoint } from "./entryPoint"

import {
    BreadcrumbListState,
    initialBreadcrumbListState,
} from "../../../auth/Outline/breadcrumbList/component"
import { initialMenuListState, MenuListState } from "../../../auth/Outline/menuList/component"
import { initialSeasonInfoState, SeasonInfoState } from "../../Outline/seasonInfo/component"
import { ExampleState, initialExampleState } from "../example/component"

export function newMockDashboard(): DashboardMockEntryPoint {
    const resource = {
        seasonInfo: initMockSeasonInfoComponent(initialSeasonInfoState),
        menuList: initMockMenuListComponent(initialMenuListState),
        breadcrumbList: initMockBreadcrumbListComponent(initialBreadcrumbListState),
        example: initMockExampleComponent(initialExampleState),
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
            menuList: update(resource.menuList),
            breadcrumbList: update(resource.breadcrumbList),
            example: update(resource.example),
        },
    }
}

export type DashboardMockEntryPoint = Readonly<{
    dashboard: DashboardEntryPoint
    update: Readonly<{
        seasonInfo: Post<SeasonInfoState>
        menuList: Post<MenuListState>
        breadcrumbList: Post<BreadcrumbListState>
        example: Post<ExampleState>
    }>
}>

function update<S, C extends MockComponent<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
