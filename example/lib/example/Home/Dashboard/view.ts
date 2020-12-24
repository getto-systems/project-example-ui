import { SeasonComponent } from "../../shared/Outline/season/component"
import { MenuComponent } from "../../shared/Outline/menu/component"
import { BreadcrumbComponent } from "../../shared/Outline/breadcrumb/component"

import { ExampleComponent } from "../example/component"

export interface DashboardEntryPointFactory {
    (): DashboardEntryPoint
}
export type DashboardEntryPoint = Readonly<{
    resource: DashboardResource
    terminate: Terminate
}>

export type DashboardResource = Readonly<{
    season: SeasonComponent
    menu: MenuComponent
    breadcrumb: BreadcrumbComponent

    example: ExampleComponent
}>

interface Terminate {
    (): void
}
