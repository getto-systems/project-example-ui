import { env } from "../../../../../y_environment/env"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { detectMenuTarget } from "../../../../../auth/x_components/Outline/Menu/impl/location"
import { detectContentPath } from "../impl/location"

import { initErrorComponent } from "../../../../../available/x_components/Error/error/impl"
import { initMenuListComponent } from "../../../../../auth/x_components/Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../../../../auth/x_components/Outline/breadcrumbList/impl"
import { initContentComponent } from "../../content/impl"

import { initNotifyAction } from "../../../../../available/x_components/Error/EntryPoint/main/core"
import {
    initCredentialAction,
    initDocumentMenuAction,
} from "../../../../../auth/x_components/Outline/Menu/main/core"

import { loadContent } from "../../../../content/impl/core"

import { DocumentEntryPoint } from "../entryPoint"

import { ContentAction } from "../../../../content/action"

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

function initContentAction(): ContentAction {
    return {
        loadContent: loadContent(),
    }
}
