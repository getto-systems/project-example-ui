import { NotifyUnexpectedErrorResource } from "../../../../avail/unexpectedError/Action/resource"
import { MenuResource } from "../../../../common/x_Resource/Outline/Menu/resource"
import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"

import { ContentComponent } from "../content/component"

export type DocumentEntryPoint = ApplicationEntryPoint<DocumentResource>

export type DocumentResource = Readonly<{
    content: ContentComponent
}> &
    NotifyUnexpectedErrorResource &
    MenuResource
