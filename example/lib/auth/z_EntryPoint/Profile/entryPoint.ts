import { MenuForegroundAction, MenuResource } from "../../../common/x_Resource/Outline/Menu/resource"
import {
    AuthProfileLogoutForegroundMaterial,
    AuthProfileLogoutResource,
} from "./resources/Logout/resource"

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
    AuthProfileLogoutResource

export type AuthProfileEntryPointMaterial = Readonly<{
    foreground: AuthProfileForegroundMaterial
}>

export type AuthProfileForegroundMaterial = ErrorForegroundAction &
    MenuForegroundAction &
    AuthProfileLogoutForegroundMaterial

export type ProfileFactory = Readonly<{
    actions: Readonly<{
        season: SeasonAction
    }> &
        AuthProfileForegroundMaterial
    components: Readonly<{
        seasonInfo: SeasonInfoComponentFactory
    }>
}>

interface Terminate {
    (): void
}
