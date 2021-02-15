import { DocumentResource } from "../entryPoint"

import { ContentComponentFactory } from "../../content/component"

import { ContentAction, LoadContentLocationInfo } from "../../../../content/action"
import { MenuForegroundAction } from "../../../../../common/x_Resource/Outline/Menu/resource"
import { OutlineActionLocationInfo } from "../../../../../auth/permission/outline/action"
import { initMenuResource } from "../../../../../common/x_Resource/Outline/Menu/impl"
import { initErrorResource } from "../../../../../availability/x_Resource/Error/impl"
import { ErrorForegroundAction } from "../../../../../availability/x_Resource/Error/resource"

export type DocumentFactory = Readonly<{
    actions: Readonly<{
        content: ContentAction
    }> &
        ErrorForegroundAction &
        MenuForegroundAction
    components: Readonly<{
        content: ContentComponentFactory
    }>
}>
export type DocumentLocationInfo = OutlineActionLocationInfo &
    Readonly<{
        content: LoadContentLocationInfo
    }>
export function initDocumentResource(
    factory: DocumentFactory,
    locationInfo: DocumentLocationInfo
): DocumentResource {
    const actions = {
        loadDocument: factory.actions.content.loadContent(locationInfo.content),
    }
    return {
        content: factory.components.content(actions),

        ...initErrorResource(factory.actions),
        ...initMenuResource(factory.actions),
    }
}
