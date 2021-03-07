import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"
import { SeasonInfoComponent } from "../../Outline/seasonInfo/component"
import { ExampleComponent } from "../example/component"
import { MenuResource } from "../../../../common/x_Resource/Outline/Menu/resource"
import { NotifyUnexpectedErrorResource } from "../../../../avail/unexpectedError/Action/resource"

export type DashboardEntryPoint = ApplicationEntryPoint<DashboardResource>

export type DashboardResource = Readonly<{
    seasonInfo: SeasonInfoComponent

    example: ExampleComponent
}> &
    NotifyUnexpectedErrorResource &
    MenuResource
