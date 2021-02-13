import {
    ClearCredentialForegroundAction,
    ClearCredentialResource,
} from "../../x_Resource/Login/ClearCredential/resource"

import {
    ErrorComponent,
    ErrorComponentFactory,
} from "../../../available/x_components/Error/error/component"
import {
    SeasonInfoComponent,
    SeasonInfoComponentFactory,
} from "../../../example/x_components/Outline/seasonInfo/component"
import { MenuListComponent, MenuListComponentFactory } from "../Outline/menuList/component"
import {
    BreadcrumbListComponent,
    BreadcrumbListComponentFactory,
} from "../Outline/breadcrumbList/component"

import { NotifyAction } from "../../../available/notify/action"
import { CredentialAction } from "../../common/credential/action"
import { MenuAction, MenuLocationInfo } from "../../permission/menu/action"
import { SeasonAction } from "../../../example/shared/season/action"

export type ProfileEntryPoint = Readonly<{
    resource: ProfileResource
    terminate: Terminate
}>

export type ProfileResource = Readonly<{
    error: ErrorComponent
    seasonInfo: SeasonInfoComponent
    menuList: MenuListComponent
    breadcrumbList: BreadcrumbListComponent
}> &
    ClearCredentialResource

export type ProfileFactory = Readonly<{
    actions: Readonly<{
        notify: NotifyAction
        credential: CredentialAction
        menu: MenuAction
        season: SeasonAction
    }> &
        ClearCredentialForegroundAction
    components: Readonly<{
        error: ErrorComponentFactory
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
