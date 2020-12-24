import { initBreadcrumb } from "../../shared/Outline/breadcrumb/mock"
import { initMenu } from "../../shared/Outline/menu/mock"
import { initSeasonComponent } from "../../shared/Outline/season/mock"

import { initExample } from "../example/mock"

import { DashboardEntryPoint } from "./view"

export function newDashboard(): DashboardEntryPoint {
    return {
        resource: {
            season: initSeasonComponent(),
            menu: initMenu(),
            breadcrumb: initBreadcrumb(),
            example: initExample(),
        },
        terminate: () => {
            // mock では何もしない
        },
    }
}
