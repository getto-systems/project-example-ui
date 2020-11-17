import { SeasonComponent } from "../system/component/season/component"
import { MenuComponent } from "../system/component/menu/component"
import { BreadcrumbComponent } from "../system/component/breadcrumb/component"

import { ExampleComponent } from "./component/example/component"

export interface DashboardFactory {
    (): DashboardResource
}
export type DashboardResource = Readonly<{
    components: DashboardComponentSet
    terminate: Terminate
}>

export type DashboardComponentSet = Readonly<{
    season: SeasonComponent
    menu: MenuComponent
    breadcrumb: BreadcrumbComponent

    example: ExampleComponent
}>

interface Terminate {
    (): void
}
