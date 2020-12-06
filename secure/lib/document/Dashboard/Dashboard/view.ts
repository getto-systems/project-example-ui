import { SeasonComponent } from "../../../common/Outline/season/component"
import { MenuComponent } from "../../../common/Outline/menu/component"
import { BreadcrumbComponent } from "../../../common/Outline/breadcrumb/component"

import { ExampleComponent } from "../example/component"

export interface DashboardFactory {
    (): DashboardEntryPoint
}
export type DashboardEntryPoint = Readonly<{
    components: DashboardComponent
    terminate: Terminate
}>

export type DashboardComponent = Readonly<{
    season: SeasonComponent
    menu: MenuComponent
    breadcrumb: BreadcrumbComponent

    example: ExampleComponent
}>

interface Terminate {
    (): void
}