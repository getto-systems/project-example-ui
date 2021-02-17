import { MenuForegroundAction, MenuResource } from "../../../common/x_Resource/Outline/Menu/resource"
import { LogoutResource } from "../../x_Resource/Profile/Logout/resource"

import {
    SeasonInfoComponent,
    SeasonInfoComponentFactory,
} from "../../../example/x_components/Outline/seasonInfo/component"

import { SeasonAction } from "../../../example/shared/season/action"
import { ErrorForegroundAction, ErrorResource } from "../../../availability/x_Resource/Error/resource"

export type AuthProfileEntryPoint = Readonly<{
    resource: AuthProfileResource
    terminate: Terminate
}>

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

interface Terminate {
    (): void
}
