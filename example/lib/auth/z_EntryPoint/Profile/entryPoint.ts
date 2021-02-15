import { MenuForegroundAction, MenuResource } from "../../../common/x_Resource/Outline/Menu/resource"
import {
    ClearCredentialForegroundAction,
    ClearCredentialResource,
} from "../../x_Resource/Sign/ClearCredential/resource"

import {
    SeasonInfoComponent,
    SeasonInfoComponentFactory,
} from "../../../example/x_components/Outline/seasonInfo/component"

import { SeasonAction } from "../../../example/shared/season/action"
import { ErrorForegroundAction, ErrorResource } from "../../../availability/x_Resource/Error/resource"

export type ProfileEntryPoint = Readonly<{
    resource: ProfileResource
    terminate: Terminate
}>

export type ProfileResource = Readonly<{
    seasonInfo: SeasonInfoComponent
}> &
    ErrorResource &
    MenuResource &
    ClearCredentialResource

export type ProfileFactory = Readonly<{
    actions: Readonly<{
        season: SeasonAction
    }> &
        ErrorForegroundAction &
        MenuForegroundAction &
        ClearCredentialForegroundAction
    components: Readonly<{
        seasonInfo: SeasonInfoComponentFactory
    }>
}>
interface Terminate {
    (): void
}
