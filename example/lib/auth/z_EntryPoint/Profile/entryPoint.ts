import { MenuForegroundActionPod, MenuResource } from "../../../common/x_Resource/Outline/Menu/resource"
import {
    ClearCredentialForegroundActionPod,
    ClearCredentialResource,
} from "../../x_Resource/Sign/ClearCredential/resource"

import {
    NotifyComponent,
    NotifyComponentFactory,
} from "../../../availability/x_Resource/NotifyError/Notify/component"
import {
    SeasonInfoComponent,
    SeasonInfoComponentFactory,
} from "../../../example/x_components/Outline/seasonInfo/component"

import { NotifyAction } from "../../../availability/error/notify/action"
import { MenuActionLocationInfo } from "../../permission/menu/action"
import { SeasonAction } from "../../../example/shared/season/action"

export type ProfileEntryPoint = Readonly<{
    resource: ProfileResource
    terminate: Terminate
}>

export type ProfileResource = Readonly<{
    error: NotifyComponent
    seasonInfo: SeasonInfoComponent
}> &
    MenuResource &
    ClearCredentialResource

export type ProfileFactory = Readonly<{
    actions: Readonly<{
        notify: NotifyAction
        season: SeasonAction
    }> &
        MenuForegroundActionPod &
        ClearCredentialForegroundActionPod
    components: Readonly<{
        error: NotifyComponentFactory
        seasonInfo: SeasonInfoComponentFactory
    }>
}>
export type ProfileLocationInfo = MenuActionLocationInfo
interface Terminate {
    (): void
}
