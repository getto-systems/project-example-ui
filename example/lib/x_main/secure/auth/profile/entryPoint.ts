import {
    MenuForegroundAction,
    MenuResource,
} from "../../../../common/x_Resource/Outline/Menu/resource"
import { LogoutResource } from "../../../../auth/sign/kernel/authInfo/clear/Action/action"

import {
    SeasonInfoComponent,
    SeasonInfoComponentFactory,
} from "../../../../example/x_components/Outline/seasonInfo/component"

import { SeasonAction } from "../../../../example/shared/season/action"
import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"
import { NotifyUnexpectedErrorResource } from "../../../../avail/unexpectedError/Action/resource"

export type AuthProfileEntryPoint = ApplicationEntryPoint<AuthProfileResource>

export type AuthProfileResource = Readonly<{
    seasonInfo: SeasonInfoComponent
}> &
    NotifyUnexpectedErrorResource &
    MenuResource &
    LogoutResource

export type AuthProfileMaterial = MenuForegroundAction

export type ProfileFactory = Readonly<{
    actions: Readonly<{
        season: SeasonAction
    }> &
        AuthProfileMaterial
    components: Readonly<{
        seasonInfo: SeasonInfoComponentFactory
    }>
}>
