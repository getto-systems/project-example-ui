import { SeasonInfoComponent } from "../../Outline/seasonInfo/component"
import { ExampleComponent } from "../example/component"
import { MenuResource } from "../../../../common/x_Resource/Outline/Menu/resource"
import { NotifyUnexpectedErrorResource } from "../../../../availability/unexpectedError/Action/resource"

export type DashboardEntryPoint = Readonly<{
    resource: DashboardResource
    terminate: Terminate
}>

export type DashboardResource = Readonly<{
    seasonInfo: SeasonInfoComponent

    example: ExampleComponent
}> &
    NotifyUnexpectedErrorResource &
    MenuResource

interface Terminate {
    (): void
}
