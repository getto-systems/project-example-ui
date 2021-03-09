import { LogoutResource } from "../sign/kernel/auth_info/action_logout/resource"

import { ApplicationEntryPoint } from "../../z_vendor/getto-application/action/action"
import { NotifyUnexpectedErrorResource } from "../../avail/action_unexpected_error/resource"
import { LoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/resource"
import { LoadMenuResource } from "../../outline/menu/action_load_menu/resource"
import { LoadSeasonResource } from "../../example/common/action_load_season/resource"

export type ProfileEntryPoint = ApplicationEntryPoint<ProfileResource>

export type ProfileResource = NotifyUnexpectedErrorResource &
    LoadBreadcrumbListResource &
    LoadMenuResource &
    LoadSeasonResource &
    LogoutResource
