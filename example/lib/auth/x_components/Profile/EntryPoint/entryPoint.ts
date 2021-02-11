import { ErrorComponent } from "../../../../available/x_components/Error/error/component"
import { SeasonInfoComponent } from "../../../../example/x_components/Outline/seasonInfo/component"
import { MenuListComponent } from "../../Outline/menuList/component"
import { BreadcrumbListComponent } from "../../Outline/breadcrumbList/component"
import { LogoutComponent } from "../logout/component"

export type ProfileEntryPoint = Readonly<{
    resource: ProfileResource
    terminate: Terminate
}>

export type ProfileResource = Readonly<{
    error: ErrorComponent
    seasonInfo: SeasonInfoComponent
    menuList: MenuListComponent
    breadcrumbList: BreadcrumbListComponent

    logout: LogoutComponent
}>

interface Terminate {
    (): void
}
