import { ApplicationEntryPoint } from "../../z_vendor/getto-application/action/action"

import { NotifyUnexpectedErrorResource } from "../../avail/action_unexpected_error/resource"
import { LoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/resource"
import { LoadMenuResource } from "../../outline/menu/action_load_menu/resource"
import { LoadDocsContentPathResource } from "../action_load_content/resource"

export type DocsContentEntryPoint = ApplicationEntryPoint<DocsContentResource>

export type DocsContentResource = NotifyUnexpectedErrorResource &
    LoadBreadcrumbListResource &
    LoadMenuResource &
    LoadDocsContentPathResource
