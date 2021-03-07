import { DocumentResource } from "../entryPoint"

import { ContentComponentFactory } from "../../content/component"

import { ContentAction, LoadContentLocationDetecter } from "../../../../content/action"
import { MenuForegroundAction } from "../../../../../common/x_Resource/Outline/Menu/resource"
import { initMenuResource } from "../../../../../common/x_Resource/Outline/Menu/impl"
import { NotifyUnexpectedErrorResource } from "../../../../../avail/unexpectedError/Action/resource"

export type DocumentFactory = Readonly<{
    actions: Readonly<{
        content: ContentAction
    }> &
        MenuForegroundAction
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
    error: NotifyUnexpectedErrorResource,
): DocumentResource {
    const actions = {
        loadDocument: factory.actions.content.loadContent(locationInfo.content),
    }
    return {
        content: factory.components.content(actions),

        ...initMenuResource(factory.actions),
        ...error,
    }
}
