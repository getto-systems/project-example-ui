import { NotifyUnexpectedErrorResource } from "../../../../avail/unexpectedError/Action/resource"
import { LoadBreadcrumbListResource } from "../../../../outline/menu/loadBreadcrumbList/Action/resource"
import { LoadMenuResource } from "../../../../outline/menu/loadMenu/Action/resource"
import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"

import { ContentComponent } from "../content/component"

export type DocumentEntryPoint = ApplicationEntryPoint<DocumentResource>

export type DocumentResource = Readonly<{
    content: ContentComponent
}> &
    NotifyUnexpectedErrorResource &
    LoadBreadcrumbListResource &
    LoadMenuResource
