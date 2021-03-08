import { LogoutResource } from "../../../../auth/sign/kernel/authInfo/clear/Action/resource"

import {
    SeasonInfoComponent,
    SeasonInfoComponentFactory,
} from "../../../../example/x_components/Outline/seasonInfo/component"

import { SeasonAction } from "../../../../example/shared/season/action"
import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"
import { NotifyUnexpectedErrorResource } from "../../../../avail/unexpectedError/Action/resource"
import { LoadBreadcrumbListResource } from "../../../../outline/menu/loadBreadcrumbList/Action/resource"
import { LoadMenuResource } from "../../../../outline/menu/loadMenu/Action/resource"

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
