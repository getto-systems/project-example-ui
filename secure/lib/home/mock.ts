import { newBreadcrumbComponent } from "../system/component/breadcrumb/mock"
import { newMenuComponent } from "../system/component/menu/mock"
import { newSeasonComponent } from "../system/component/season/mock"

import { newExampleComponent } from "./component/example/mock"

import { DashboardResource } from "./dashboard"

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
