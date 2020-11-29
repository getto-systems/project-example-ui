import { SeasonComponent } from "../../Outline/season/component"
import { MenuComponent } from "../../Outline/menu/component"
import { BreadcrumbComponent } from "../../Outline/breadcrumb/component"

import { ExampleComponent } from "../example/component"

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
