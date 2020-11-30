import { initBreadcrumb } from "../../Outline/breadcrumb/mock"
import { initMenu } from "../../Outline/menu/mock"
import { initSeason } from "../../Outline/season/mock"

import { initExample } from "../example/mock"

import { DashboardFactory } from "./view"

export function newDashboard(): DashboardFactory {
    return () => {
        return {
            components: {
                season: initSeason(),
                menu: initMenu(),
                breadcrumb: initBreadcrumb(),
                example: initExample(),
            },
            terminate: () => {
                // mock では何もしない
            }
        }
    }
}
