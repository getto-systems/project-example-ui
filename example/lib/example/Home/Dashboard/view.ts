import { SeasonInfoComponent } from "../../Outline/seasonInfo/component"
import { MenuListComponent } from "../../Outline/menuList/component"
import { BreadcrumbListComponent } from "../../Outline/breadcrumbList/component"

import { ExampleComponent } from "../example/component"

export type DashboardEntryPoint = Readonly<{
    resource: DashboardResource
    terminate: Terminate
}>

export type DashboardResource = Readonly<{
    seasonInfo: SeasonInfoComponent
    menuList: MenuListComponent
    breadcrumbList: BreadcrumbListComponent

    example: ExampleComponent
}>

interface Terminate {
    (): void
}
