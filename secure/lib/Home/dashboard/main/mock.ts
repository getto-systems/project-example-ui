import { newBreadcrumbComponent } from "../../../System/component/breadcrumb/mock"
import { newMenuComponent } from "../../../System/component/menu/mock"
import { newSeasonComponent } from "../../../System/component/season/mock"

import { newExampleComponent } from "../../component/example/mock"

import { DashboardFactory } from "../view"

export function newDashboardComponentSetFactory(): DashboardFactory {
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
