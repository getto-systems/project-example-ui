import { NotifyComponent } from "../../../../availability/x_Resource/NotifyError/Notify/component"
import { SeasonInfoComponent } from "../../Outline/seasonInfo/component"
import { ExampleComponent } from "../example/component"
import { MenuResource } from "../../../../common/x_Resource/Outline/Menu/resource"

export type DashboardEntryPoint = Readonly<{
    resource: DashboardResource
    terminate: Terminate
}>

export type DashboardResource = Readonly<{
    error: NotifyComponent
    seasonInfo: SeasonInfoComponent

    example: ExampleComponent
}> &
    MenuResource

interface Terminate {
    (): void
}
