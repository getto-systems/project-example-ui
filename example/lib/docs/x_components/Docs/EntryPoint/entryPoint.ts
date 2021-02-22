import { MenuResource } from "../../../../common/x_Resource/Outline/Menu/resource"

import { ContentComponent } from "../content/component"
import { ErrorResource } from "../../../../availability/x_Resource/Error/resource"

export type DocumentEntryPoint = Readonly<{
    resource: DocumentResource
    terminate: Terminate
}>

export type DocumentResource = Readonly<{
    content: ContentComponent
}> &
    ErrorResource &
    MenuResource

interface Terminate {
    (): void
}
