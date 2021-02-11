import { ErrorComponent } from "../../../../available/x_components/Error/error/component"
import { SeasonInfoComponent } from "../../Outline/seasonInfo/component"
import { MenuListComponent } from "../../../../auth/x_components/Outline/menuList/component"
import { BreadcrumbListComponent } from "../../../../auth/x_components/Outline/breadcrumbList/component"
import { ExampleComponent } from "../example/component"

export type DashboardEntryPoint = Readonly<{
    resource: DashboardResource
    terminate: Terminate
}>

export type DashboardResource = Readonly<{
    error: ErrorComponent
    seasonInfo: SeasonInfoComponent
    menuList: MenuListComponent
    breadcrumbList: BreadcrumbListComponent

    example: ExampleComponent
}>

interface Terminate {
    (): void
}
