import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"
import { SeasonInfoComponent } from "../../Outline/seasonInfo/component"
import { ExampleComponent } from "../example/component"
import { NotifyUnexpectedErrorResource } from "../../../../avail/action_unexpected_error/resource"
import { LoadMenuResource } from "../../../../outline/menu/action_load_menu/resource"
import { LoadBreadcrumbListResource } from "../../../../outline/menu/action_load_breadcrumb_list/resource"

export type DashboardEntryPoint = ApplicationEntryPoint<DashboardResource>

export type DashboardResource = Readonly<{
    seasonInfo: SeasonInfoComponent

    example: ExampleComponent
}> &
    NotifyUnexpectedErrorResource &
    LoadBreadcrumbListResource &
    LoadMenuResource
