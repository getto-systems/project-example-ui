import { ApplicationView } from "../../z_vendor/getto-application/action/action"

import { NotifyUnexpectedErrorResource } from "../../avail/action_notify_unexpected_error/resource"
import { LoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/resource"
import { LoadMenuResource } from "../../outline/menu/action_load_menu/resource"

export type DocsView = ApplicationView<DocsResource>

export type DocsResource = NotifyUnexpectedErrorResource &
    LoadBreadcrumbListResource &
    LoadMenuResource
