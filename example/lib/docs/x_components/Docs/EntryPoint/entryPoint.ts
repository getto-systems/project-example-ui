import { NotifyUnexpectedErrorResource } from "../../../../avail/action_unexpected_error/resource"
import { LoadBreadcrumbListResource } from "../../../../outline/menu/action_load_breadcrumb_list/resource"
import { LoadMenuResource } from "../../../../outline/menu/action_load_menu/resource"
import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"

import { ContentComponent } from "../content/component"

export type DocumentEntryPoint = ApplicationEntryPoint<DocumentResource>

export type DocumentResource = Readonly<{
    content: ContentComponent
}> &
    NotifyUnexpectedErrorResource &
    LoadBreadcrumbListResource &
    LoadMenuResource
