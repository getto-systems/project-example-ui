import { MockComponent } from "../../../z_external/mock/component"

import { initBreadcrumb } from "../../shared/Outline/breadcrumbList/mock"
import { initMenu } from "../../shared/Outline/menuList/mock"
import { initSeason } from "../../shared/Outline/seasonInfo/mock"
import { initExample } from "../example/mock"

import { DashboardEntryPoint } from "./view"

import { BreadcrumbListState, initialBreadcrumbListState } from "../../shared/Outline/breadcrumbList/component"
import { initialMenuListState, MenuListState } from "../../shared/Outline/menuList/component"
import { initialSeasonInfoState, SeasonInfoState } from "../../shared/Outline/seasonInfo/component"
import { ExampleState, initialExampleState } from "../example/component"

export function newDashboard(): DashboardMockEntryPoint {
    const resource = {
        season: initSeason(initialSeasonInfoState),
        menu: initMenu(initialMenuListState),
        breadcrumb: initBreadcrumb(initialBreadcrumbListState),
        example: initExample(initialExampleState),
    }
    return {
        dashboard: {
            resource,
            terminate: () => {
                // mock では特に何もしない
            },
        },
        update: {
            season: update(resource.season),
            menu: update(resource.menu),
            breadcrumb: update(resource.breadcrumb),
            example: update(resource.example),
        },
    }
}

export type DashboardMockEntryPoint = Readonly<{
    dashboard: DashboardEntryPoint
    update: Readonly<{
        season: Post<SeasonInfoState>
        menu: Post<MenuListState>
        breadcrumb: Post<BreadcrumbListState>
        example: Post<ExampleState>
    }>
}>

function update<S, C extends MockComponent<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
