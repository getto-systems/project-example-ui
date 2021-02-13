import { DocumentResource } from "../entryPoint"

import { ErrorComponentFactory } from "../../../../../availability/x_Resource/Error/error/component"
import { MenuListComponentFactory } from "../../../../../auth/z_EntryPoint/Outline/menuList/component"
import { BreadcrumbListComponentFactory } from "../../../../../auth/z_EntryPoint/Outline/breadcrumbList/component"

import { ContentComponentFactory } from "../../content/component"

import { CredentialAction } from "../../../../../auth/common/credential/action"
import { MenuAction, MenuLocationInfo } from "../../../../../auth/permission/menu/action"

import { ContentAction, LoadContentLocationInfo } from "../../../../content/action"
import { NotifyAction } from "../../../../../availability/notify/action"

export type DocumentFactory = Readonly<{
    actions: Readonly<{
        notify: NotifyAction
        credential: CredentialAction
        menu: MenuAction
        content: ContentAction
    }>
    components: Readonly<{
        error: ErrorComponentFactory
        menuList: MenuListComponentFactory
        breadcrumbList: BreadcrumbListComponentFactory

        content: ContentComponentFactory
    }>
}>
export type DocumentLocationInfo = Readonly<{
    menu: MenuLocationInfo
    content: LoadContentLocationInfo
}>
export function initDocumentResource(
    factory: DocumentFactory,
    locationInfo: DocumentLocationInfo
): DocumentResource {
    const actions = {
        notify: factory.actions.notify.notify(),

        loadApiNonce: factory.actions.credential.loadApiNonce(),
        loadApiRoles: factory.actions.credential.loadApiRoles(),

        loadBreadcrumb: factory.actions.menu.loadBreadcrumb(locationInfo.menu),
        loadMenu: factory.actions.menu.loadMenu(locationInfo.menu),
        toggleMenuExpand: factory.actions.menu.toggleMenuExpand(),

        loadDocument: factory.actions.content.loadContent(locationInfo.content),
    }
    return {
        error: factory.components.error(actions),
        menuList: factory.components.menuList(actions),
        breadcrumbList: factory.components.breadcrumbList(actions),

        content: factory.components.content(actions),
    }
}
