import { env } from "../../../../../y_environment/env"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { detectMenuTarget } from "../../../../../auth/permission/menu/impl/location"
import { detectContentPath } from "../../../../content/impl/location"

import { initErrorComponent } from "../../../../../available/x_components/Error/error/impl"
import { initMenuListComponent } from "../../../../../auth/z_EntryPoint/Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../../../../auth/z_EntryPoint/Outline/breadcrumbList/impl"
import { initContentComponent } from "../../content/impl"

import { initNotifyAction } from "../../../../../available/notify/main/notify"
import { initCredentialAction } from "../../../../../auth/common/credential/main/credential"
import { initDocumentMenuAction } from "../../../../../auth/permission/menu/main/documentMenu"

import { DocumentEntryPoint } from "../entryPoint"

import { initContentAction } from "../../../../content/main/content"

export function newDocumentAsSingle(): DocumentEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: DocumentFactory = {
        actions: {
            notify: initNotifyAction(),
            credential: initCredentialAction(webStorage),
            menu: initDocumentMenuAction(webStorage),
            content: initContentAction(),
        },
        components: {
            error: initErrorComponent,
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
