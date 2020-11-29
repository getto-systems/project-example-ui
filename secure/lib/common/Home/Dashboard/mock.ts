import { newBreadcrumbComponent } from "../../Outline/breadcrumb/mock"
import { newMenuComponent } from "../../Outline/menu/mock"
import { newSeasonComponent } from "../../Outline/season/mock"

import { newExampleComponent } from "../example/mock"

import { DashboardFactory } from "./view"

export function newDashboard(): DashboardFactory {
    return () => {
        return {
            components: {
                season: newSeasonComponent(),
                menu: newMenuComponent(),
                breadcrumb: newBreadcrumbComponent(),
                example: newExampleComponent(),
            },
            terminate: () => {
                // mock では何もしない
            }
        }
    }
}
