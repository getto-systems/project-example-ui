import { DocumentResource } from "../entryPoint"

import { ContentComponentFactory } from "../../content/component"

import { ContentAction, LoadContentLocationDetecter } from "../../../../content/action"
import { NotifyUnexpectedErrorResource } from "../../../../../avail/unexpectedError/Action/resource"
import { LoadBreadcrumbListResource } from "../../../../../outline/menu/loadBreadcrumbList/Action/resource"
import { LoadMenuResource } from "../../../../../outline/menu/loadMenu/Action/resource"

export type DocumentFactory = Readonly<{
    actions: Readonly<{
        content: ContentAction
    }>
    components: Readonly<{
        content: ContentComponentFactory
    }>
}>
export type DocumentLocationInfo = Readonly<{
    content: LoadContentLocationDetecter
}>
export function initDocumentResource(
    factory: DocumentFactory,
    locationInfo: DocumentLocationInfo,
    breadcrumbList: LoadBreadcrumbListResource,
    menu: LoadMenuResource,
    error: NotifyUnexpectedErrorResource,
): DocumentResource {
    const actions = {
        loadDocument: factory.actions.content.loadContent(locationInfo.content),
    }
    return {
        content: factory.components.content(actions),

        ...breadcrumbList,
        ...menu,
        ...error,
    }
}
