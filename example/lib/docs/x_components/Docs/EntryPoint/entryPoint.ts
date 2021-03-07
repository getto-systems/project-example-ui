import { NotifyUnexpectedErrorResource } from "../../../../avail/unexpectedError/Action/resource"
import { MenuResource } from "../../../../common/x_Resource/Outline/Menu/resource"

import { ContentComponent } from "../content/component"

export type DocumentEntryPoint = Readonly<{
    resource: DocumentResource
    terminate: Terminate
}>

export type DocumentResource = Readonly<{
    content: ContentComponent
}> &
    NotifyUnexpectedErrorResource &
    MenuResource

interface Terminate {
    (): void
}
