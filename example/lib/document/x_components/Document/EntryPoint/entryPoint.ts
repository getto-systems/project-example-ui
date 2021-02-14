import { MenuResource } from "../../../../common/x_Resource/Outline/Menu/resource"

import { NotifyComponent } from "../../../../availability/x_Resource/NotifyError/Notify/component"
import { ContentComponent } from "../content/component"

export type DocumentEntryPoint = Readonly<{
    resource: DocumentResource
    terminate: Terminate
}>

export type DocumentResource = Readonly<{
    error: NotifyComponent
    content: ContentComponent
}> &
    MenuResource

interface Terminate {
    (): void
}
