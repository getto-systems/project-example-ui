import { SeasonInfoComponent } from "../../shared/Outline/seasonInfo/component"
import { MenuListComponent } from "../../shared/Outline/menuList/component"
import { BreadcrumbListComponent } from "../../shared/Outline/breadcrumbList/component"

import { ExampleComponent } from "../example/component"

export type DashboardEntryPoint = Readonly<{
    resource: DashboardResource
    terminate: Terminate
}>

export type DashboardResource = Readonly<{
    season: SeasonInfoComponent
    menu: MenuListComponent
    breadcrumb: BreadcrumbListComponent

    example: ExampleComponent
}>

interface Terminate {
    (): void
}
