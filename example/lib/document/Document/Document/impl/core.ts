import { DocumentComponent } from "../view"

import { MenuComponentFactory } from "../../../../example/shared/Outline/menu/component"
import { BreadcrumbComponentFactory } from "../../../../example/shared/Outline/breadcrumb/component"

import { ContentComponentFactory } from "../../content/component"

import { LoadApiNonce, LoadApiRoles } from "../../../../example/shared/credential/action"
import { LoadBreadcrumb, LoadMenu, MenuTargetCollector, ToggleMenuExpand } from "../../../../example/shared/menu/action"

import { LoadContentCollector, LoadContentPod } from "../../../content/action"

export type DocumentFactory = Readonly<{
    actions: Readonly<{
        credential: Readonly<{
            loadApiNonce: LoadApiNonce
            loadApiRoles: LoadApiRoles
        }>
        menu: Readonly<{
            loadBreadcrumb: LoadBreadcrumb
            loadMenu: LoadMenu
            toggleMenuExpand: ToggleMenuExpand
        }>
        content: Readonly<{
            loadDocument: LoadContentPod
        }>
    }>
    components: Readonly<{
        menu: MenuComponentFactory
        breadcrumb: BreadcrumbComponentFactory

        content: ContentComponentFactory
    }>
}>
export type DocumentCollectorSet = Readonly<{
    menu: MenuTargetCollector
    content: LoadContentCollector
}>
export function initDocumentComponent(
    factory: DocumentFactory,
    collector: DocumentCollectorSet
): DocumentComponent {
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
