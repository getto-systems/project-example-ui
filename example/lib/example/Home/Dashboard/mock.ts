import { MockComponent_legacy } from "../../../sub/getto-example/application/mock"

import { initMockBreadcrumbListComponent } from "../../../auth/Outline/breadcrumbList/mock"
import { initMockMenuListComponent } from "../../../auth/Outline/menuList/mock"
import { initMockSeasonInfoComponent } from "../../Outline/seasonInfo/mock"
import { initMockExampleComponent } from "../example/mock"

import { DashboardEntryPoint } from "./entryPoint"

import {
    BreadcrumbListComponentState,
    initialBreadcrumbListComponentState,
} from "../../../auth/Outline/breadcrumbList/component"
import { initialMenuListComponentState, MenuListComponentState } from "../../../auth/Outline/menuList/component"
import { initialSeasonInfoComponentState, SeasonInfoComponentState } from "../../Outline/seasonInfo/component"
import { ExampleComponentState, initialExampleComponentState } from "../example/component"

export function newMockDashboard(): DashboardMockEntryPoint {
    const resource = {
        seasonInfo: initMockSeasonInfoComponent(initialSeasonInfoComponentState),
        menuList: initMockMenuListComponent(initialMenuListComponentState),
        breadcrumbList: initMockBreadcrumbListComponent(initialBreadcrumbListComponentState),
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
            menuList: update(resource.menuList),
            breadcrumbList: update(resource.breadcrumbList),
            example: update(resource.example),
        },
    }
}

export type DashboardMockEntryPoint = Readonly<{
    dashboard: DashboardEntryPoint
    update: Readonly<{
        seasonInfo: Post<SeasonInfoComponentState>
        menuList: Post<MenuListComponentState>
        breadcrumbList: Post<BreadcrumbListComponentState>
        example: Post<ExampleComponentState>
    }>
}>

function update<S, C extends MockComponent_legacy<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
