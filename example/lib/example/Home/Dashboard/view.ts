import { SeasonInfoComponent } from "../../Outline/seasonInfo/component"
import { MenuListComponent } from "../../Outline/menuList/component"
import { BreadcrumbListComponent } from "../../Outline/breadcrumbList/component"

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
