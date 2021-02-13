import { NotifyComponent } from "../../../../availability/x_Resource/NotifyError/Notify/component"
import { SeasonInfoComponent } from "../../Outline/seasonInfo/component"
import { MenuListComponent } from "../../../../auth/z_EntryPoint/Outline/menuList/component"
import { BreadcrumbListComponent } from "../../../../auth/z_EntryPoint/Outline/breadcrumbList/component"
import { ExampleComponent } from "../example/component"

export type DashboardEntryPoint = Readonly<{
    resource: DashboardResource
    terminate: Terminate
}>

export type DashboardResource = Readonly<{
    error: NotifyComponent
    seasonInfo: SeasonInfoComponent
    menuList: MenuListComponent
    breadcrumbList: BreadcrumbListComponent

    example: ExampleComponent
}>

interface Terminate {
    (): void
}
