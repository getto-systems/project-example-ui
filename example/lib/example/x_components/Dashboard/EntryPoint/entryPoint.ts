import { SeasonInfoComponent } from "../../Outline/seasonInfo/component"
import { ExampleComponent } from "../example/component"
import { MenuResource } from "../../../../common/x_Resource/Outline/Menu/resource"
import { ErrorResource } from "../../../../availability/x_Resource/Error/resource"

export type DashboardEntryPoint = Readonly<{
    resource: DashboardResource
    terminate: Terminate
}>

export type DashboardResource = Readonly<{
    seasonInfo: SeasonInfoComponent

    example: ExampleComponent
}> &
    ErrorResource &
    MenuResource

interface Terminate {
    (): void
}
