import { env } from "../../../../../y_environment/env"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { detectContentPath } from "../../../../content/impl/location"

import { initNotifyComponent } from "../../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initContentComponent } from "../../content/impl"

import { newNotifyAction } from "../../../../../availability/error/notify/main/notify"

import { DocumentEntryPoint } from "../entryPoint"

import { initContentAction } from "../../../../content/main/content"
import { newDocumentOutlineAction } from "../../../../../auth/permission/outline/main/document"
import { newOutlineActionLocationInfo } from "../../../../../auth/permission/outline/main/common"

export function newDocumentAsSingle(): DocumentEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: DocumentFactory = {
        actions: {
            ...newDocumentOutlineAction(webStorage),

            notify: newNotifyAction(),
            content: initContentAction(),
        },
        components: {
            error: initNotifyComponent,
            content: initContentComponent,
        },
    }
    const locationInfo: DocumentLocationInfo = {
        ...newOutlineActionLocationInfo(),
        content: {
            getContentPath: () => detectContentPath(env.version, currentURL),
        },
    }
    const resource = initDocumentResource(factory, locationInfo)
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
            resource.breadcrumbList.terminate()
            resource.content.terminate()
        },
    }
}
