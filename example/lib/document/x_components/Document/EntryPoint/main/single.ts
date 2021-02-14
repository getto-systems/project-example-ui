import { env } from "../../../../../y_environment/env"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { detectMenuTarget } from "../../../../../auth/permission/menu/impl"
import { detectContentPath } from "../../../../content/impl/location"

import { initNotifyComponent } from "../../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initContentComponent } from "../../content/impl"

import { initNotifyAction } from "../../../../../availability/error/notify/main/notify"

import { DocumentEntryPoint } from "../entryPoint"

import { initContentAction } from "../../../../content/main/content"
import {
    newDocumentBreadcrumbListActionPod,
    newDocumentMenuActionPod,
} from "../../../../../auth/permission/menu/main/document"

export function newDocumentAsSingle(): DocumentEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: DocumentFactory = {
        actions: {
            initBreadcrumbList: newDocumentBreadcrumbListActionPod(),
            initMenu: newDocumentMenuActionPod(webStorage),

            notify: initNotifyAction(),
            content: initContentAction(),
        },
        components: {
            error: initNotifyComponent,
            content: initContentComponent,
        },
    }
    const locationInfo: DocumentLocationInfo = {
        getMenuTarget: () => detectMenuTarget(env.version, currentURL),
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
