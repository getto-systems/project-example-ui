import { ApplicationEntryPoint } from "../../z_vendor/getto-application/action/action"
import { NotifyUnexpectedErrorResource } from "../../avail/action_unexpected_error/resource"
import { LoadMenuResource } from "../../outline/menu/action_load_menu/resource"
import { LoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/resource"
import { LoadSeasonResource } from "../common/action_load_season/resource"

export type DashboardEntryPoint = ApplicationEntryPoint<DashboardResource>

export type DashboardResource = NotifyUnexpectedErrorResource &
    LoadBreadcrumbListResource &
    LoadMenuResource &
    LoadSeasonResource
