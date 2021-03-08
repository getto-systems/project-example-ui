import { DocumentResource } from "../entryPoint"

import { ContentComponentFactory } from "../../content/component"

import { ContentAction, LoadContentLocationDetecter } from "../../../../content/action"
import { NotifyUnexpectedErrorResource } from "../../../../../avail/action_unexpected_error/resource"
import { LoadBreadcrumbListResource } from "../../../../../outline/menu/action_load_breadcrumb_list/resource"
import { LoadMenuResource } from "../../../../../outline/menu/action_load_menu/resource"

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
