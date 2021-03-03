import {
    MenuForegroundAction,
    MenuResource,
} from "../../../../common/x_Resource/Outline/Menu/resource"
import { LogoutResource } from "../../../../auth/sign/kernel/authInfo/clear/x_Action/Logout/action"

import {
    SeasonInfoComponent,
    SeasonInfoComponentFactory,
} from "../../../../example/x_components/Outline/seasonInfo/component"

import { SeasonAction } from "../../../../example/shared/season/action"
import {
    ErrorForegroundAction,
    ErrorResource,
} from "../../../../availability/x_Resource/Error/resource"
import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"

export type AuthProfileEntryPoint = ApplicationEntryPoint<AuthProfileResource>

export type AuthProfileResource = Readonly<{
    seasonInfo: SeasonInfoComponent
}> &
    ErrorResource &
    MenuResource &
    LogoutResource

export type AuthProfileMaterial = ErrorForegroundAction & MenuForegroundAction

export type ProfileFactory = Readonly<{
    actions: Readonly<{
        season: SeasonAction
    }> &
        AuthProfileMaterial
    components: Readonly<{
        seasonInfo: SeasonInfoComponentFactory
    }>
}>
