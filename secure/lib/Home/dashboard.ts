import { SeasonComponent } from "../System/component/season/component"
import { MenuComponent } from "../System/component/menu/component"
import { BreadcrumbComponent } from "../System/component/breadcrumb/component"

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
