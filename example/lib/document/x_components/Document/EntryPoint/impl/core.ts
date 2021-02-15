import { DocumentResource } from "../entryPoint"

import { NotifyComponentFactory } from "../../../../../availability/x_Resource/NotifyError/Notify/component"

import { ContentComponentFactory } from "../../content/component"

import { ContentAction, LoadContentLocationInfo } from "../../../../content/action"
import { NotifyAction } from "../../../../../availability/error/notify/action"
import { MenuForegroundAction } from "../../../../../common/x_Resource/Outline/Menu/resource"
import { OutlineActionLocationInfo } from "../../../../../auth/permission/outline/action"
import { initMenuResource } from "../../../../../common/x_Resource/Outline/Menu/impl"

export type DocumentFactory = Readonly<{
    actions: Readonly<{
        notify: NotifyAction
        content: ContentAction
    }> &
        MenuForegroundAction
    components: Readonly<{
        error: NotifyComponentFactory
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
        notify: factory.actions.notify.notify(),
        loadDocument: factory.actions.content.loadContent(locationInfo.content),
    }
    return {
        error: factory.components.error(actions),
        content: factory.components.content(actions),

        ...initMenuResource(factory.actions),
    }
}
