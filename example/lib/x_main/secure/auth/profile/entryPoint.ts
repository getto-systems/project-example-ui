import { LogoutResource } from "../../../../auth/sign/kernel/auth_info/action_logout/resource"

import {
    SeasonInfoComponent,
    SeasonInfoComponentFactory,
} from "../../../../example/x_components/Outline/seasonInfo/component"

import { SeasonAction } from "../../../../example/shared/season/action"
import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"
import { NotifyUnexpectedErrorResource } from "../../../../avail/action_unexpected_error/resource"
import { LoadBreadcrumbListResource } from "../../../../outline/menu/action_load_breadcrumb_list/resource"
import { LoadMenuResource } from "../../../../outline/menu/action_load_menu/resource"

export type AuthProfileEntryPoint = ApplicationEntryPoint<AuthProfileResource>

export type AuthProfileResource = Readonly<{
    seasonInfo: SeasonInfoComponent
}> &
    NotifyUnexpectedErrorResource &
    LoadBreadcrumbListResource &
    LoadMenuResource &
    LogoutResource

export type ProfileFactory = Readonly<{
    actions: Readonly<{
        season: SeasonAction
    }>
    components: Readonly<{
        seasonInfo: SeasonInfoComponentFactory
    }>
}>
