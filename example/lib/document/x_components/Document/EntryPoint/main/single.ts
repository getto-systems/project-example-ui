import { env } from "../../../../../y_environment/env"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { detectMenuTarget } from "../../../../../auth/permission/menu/impl/location"
import { detectContentPath } from "../../../../content/impl/location"

import { initNotifyComponent } from "../../../../../availability/x_Resource/NotifyError/Notify/impl"
import { initMenuListComponent } from "../../../../../auth/z_EntryPoint/Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../../../../auth/z_EntryPoint/Outline/breadcrumbList/impl"
import { initContentComponent } from "../../content/impl"

import { initNotifyAction } from "../../../../../availability/error/notify/main/notify"
import { initDocumentMenuAction } from "../../../../../auth/permission/menu/main/documentMenu"

import { DocumentEntryPoint } from "../entryPoint"

import { initContentAction } from "../../../../content/main/content"

export function newDocumentAsSingle(): DocumentEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: DocumentFactory = {
        actions: {
            notify: initNotifyAction(),
            menu: initDocumentMenuAction(webStorage),
            content: initContentAction(),
        },
        components: {
            error: initNotifyComponent,
            menuList: initMenuListComponent,
            breadcrumbList: initBreadcrumbListComponent,

            content: initContentComponent,
        },
    }
    const locationInfo: DocumentLocationInfo = {
        menu: {
            getMenuTarget: () => detectMenuTarget(env.version, currentURL),
        },
        content: {
            getContentPath: () => detectContentPath(env.version, currentURL),
        },
    }
    const resource = initDocumentResource(factory, locationInfo)
    return {
        resource,
        terminate: () => {
            resource.menuList.terminate()
            resource.breadcrumbList.terminate()
            resource.content.terminate()
        },
    }
}
