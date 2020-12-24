import { initBreadcrumbComponent } from "../../shared/Outline/breadcrumb/mock"
import { initMenuComponent } from "../../shared/Outline/menu/mock"
import { initSeasonComponent } from "../../shared/Outline/season/mock"

import { initExampleComponent } from "../example/mock"

import { DashboardEntryPoint } from "./view"

export function newDashboard(): DashboardEntryPoint {
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
