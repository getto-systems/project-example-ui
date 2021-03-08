import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"
import { SeasonInfoComponent } from "../../Outline/seasonInfo/component"
import { ExampleComponent } from "../example/component"
import { NotifyUnexpectedErrorResource } from "../../../../avail/unexpectedError/Action/resource"
import { LoadMenuResource } from "../../../../outline/menu/loadMenu/Action/resource"
import { LoadBreadcrumbListResource } from "../../../../outline/menu/loadBreadcrumbList/Action/resource"

export type DashboardEntryPoint = ApplicationEntryPoint<DashboardResource>

export type DashboardResource = Readonly<{
    seasonInfo: SeasonInfoComponent

    example: ExampleComponent
}> &
    NotifyUnexpectedErrorResource &
    LoadBreadcrumbListResource &
    LoadMenuResource
