import { initBreadcrumb } from "../../shared/Outline/breadcrumb/mock"
import { initMenu } from "../../shared/Outline/menu/mock"
import { initSeason } from "../../shared/Outline/season/mock"

import { initExample } from "../example/mock"

import { DashboardEntryPointFactory } from "./view"

export function newDashboard(): DashboardEntryPointFactory {
    return () => {
        return {
            resource: {
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
