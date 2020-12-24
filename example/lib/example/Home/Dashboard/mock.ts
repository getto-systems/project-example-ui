import { MockComponent } from "../../../z_external/mock/component"

import { initBreadcrumb, initBreadcrumbComponent } from "../../shared/Outline/breadcrumb/mock"
import { initMenu, initMenuComponent } from "../../shared/Outline/menu/mock"
import { initSeason, initSeasonComponent } from "../../shared/Outline/season/mock"
import { initExample, initExampleComponent } from "../example/mock"

import { DashboardEntryPoint } from "./view"

import { BreadcrumbState, initialBreadcrumbState } from "../../shared/Outline/breadcrumb/component"
import { initialMenuState, MenuState } from "../../shared/Outline/menu/component"
import { initialSeasonState, SeasonState } from "../../shared/Outline/season/component"
import { ExampleState, initialExampleState } from "../example/component"

export function newDashboardAsMock(): DashboardEntryPoint {
    return {
        resource: {
            season: initSeasonComponent(),
            menu: initMenuComponent(),
            breadcrumb: initBreadcrumbComponent(),
            example: initExampleComponent(),
        },
        terminate: () => {
            // mock では何もしない
        },
    }
}
export function newDashboard(): DashboardMockEntryPoint {
    const resource = {
        season: initSeason(initialSeasonState),
        menu: initMenu(initialMenuState),
        breadcrumb: initBreadcrumb(initialBreadcrumbState),
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
        season: Post<SeasonState>
        menu: Post<MenuState>
        breadcrumb: Post<BreadcrumbState>
        example: Post<ExampleState>
    }>
}>

function update<S, C extends MockComponent<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
