import { ApplicationEntryPoint } from "../../z_vendor/getto-application/action/action"

import { NotifyUnexpectedErrorResource } from "../../avail/action_notify_unexpected_error/resource"
import { LoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/resource"
import { LoadMenuResource } from "../../outline/menu/action_load_menu/resource"
import { DocsSection } from "../../z_vendor/getto-application/docs/data"

export type DocsEntryPoint = ApplicationEntryPoint<DocsResource>

export type DocsResource = NotifyUnexpectedErrorResource &
    LoadBreadcrumbListResource &
    LoadMenuResource &
    DocsContent
export type DocsContent = Readonly<{
    docs: Readonly<{
        title: string
        contents: DocsSection[][][]
    }>
}>
