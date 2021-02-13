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
import { MenuListComponent, MenuListComponentFactory } from "../Outline/menuList/component"
import {
    BreadcrumbListComponent,
    BreadcrumbListComponentFactory,
} from "../Outline/breadcrumbList/component"

import { NotifyAction } from "../../../availability/error/notify/action"
import { MenuAction, MenuLocationInfo } from "../../permission/menu/action"
import { SeasonAction } from "../../../example/shared/season/action"

export type ProfileEntryPoint = Readonly<{
    resource: ProfileResource
    terminate: Terminate
}>

export type ProfileResource = Readonly<{
    error: NotifyComponent
    seasonInfo: SeasonInfoComponent
    menuList: MenuListComponent
    breadcrumbList: BreadcrumbListComponent
}> &
    ClearCredentialResource

export type ProfileFactory = Readonly<{
    actions: Readonly<{
        notify: NotifyAction
        menu: MenuAction
        season: SeasonAction
    }> &
        ClearCredentialForegroundActionPod
    components: Readonly<{
        error: NotifyComponentFactory
        seasonInfo: SeasonInfoComponentFactory
        menuList: MenuListComponentFactory
        breadcrumbList: BreadcrumbListComponentFactory
    }>
}>
export type ProfileLocationInfo = Readonly<{
    menu: MenuLocationInfo
}>
interface Terminate {
    (): void
}
