import { newBreadcrumbComponent } from "../system/breadcrumb"
import { newMenuComponent } from "../system/menu"
import { newSeasonComponent } from "../system/season"

import { newExampleComponent } from "./dashboard/example"

import { DashboardResource } from "../../home/dashboard"

export function newDashboardComponentSetFactory(): Factory<DashboardResource> {
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

interface Factory<T> {
    (): T
}
