import { DocumentResource } from "../view"

import { MenuListComponentFactory } from "../../../../example/Outline/menuList/component"
import { BreadcrumbListComponentFactory } from "../../../../example/Outline/breadcrumbList/component"

import { ContentComponentFactory } from "../../content/component"

import { LoadApiNoncePod, LoadApiRolesPod } from "../../../../example/shared/credential/action"
import { LoadBreadcrumbPod, LoadMenuPod, MenuTargetCollector, ToggleMenuExpandPod } from "../../../../example/shared/menu/action"

import { LoadContentCollector, LoadContentPod } from "../../../content/action"

export type DocumentFactory = Readonly<{
    actions: Readonly<{
        credential: Readonly<{
            loadApiNonce: LoadApiNoncePod
            loadApiRoles: LoadApiRolesPod
        }>
        menu: Readonly<{
            loadBreadcrumb: LoadBreadcrumbPod
            loadMenu: LoadMenuPod
            toggleMenuExpand: ToggleMenuExpandPod
        }>
        content: Readonly<{
            loadDocument: LoadContentPod
        }>
    }>
    components: Readonly<{
        menu: MenuListComponentFactory
        breadcrumb: BreadcrumbListComponentFactory

        content: ContentComponentFactory
    }>
}>
export type DocumentCollector = Readonly<{
    menu: MenuTargetCollector
    content: LoadContentCollector
}>
export function initDocumentComponent(
    factory: DocumentFactory,
    collector: DocumentCollector
): DocumentResource {
    const actions = {
        loadApiNonce: factory.actions.credential.loadApiNonce(),
        loadApiRoles: factory.actions.credential.loadApiRoles(),

        loadBreadcrumb: factory.actions.menu.loadBreadcrumb(collector.menu),
        loadMenu: factory.actions.menu.loadMenu(collector.menu),
        toggleMenuExpand: factory.actions.menu.toggleMenuExpand(),

        loadDocument: factory.actions.content.loadDocument(collector.content),
    }
    return {
        menu: factory.components.menu(actions),
        breadcrumb: factory.components.breadcrumb(actions),

        content: factory.components.content(actions),
    }
}
