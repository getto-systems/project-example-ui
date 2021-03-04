import { env } from "../../../../../y_environment/env"

import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { detectContentPath } from "../../../../content/impl/location"

import { initContentComponent } from "../../content/impl"

import { newErrorAction } from "../../../../../availability/unexpectedError/main"

import { DocumentEntryPoint } from "../entryPoint"

import { initContentAction } from "../../../../content/main/content"
import { newDocumentOutlineAction } from "../../../../../auth/permission/outline/load/main/document"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentURL: URL
    currentLocation: Location
}>
export function newForeground(feature: OutsideFeature): DocumentEntryPoint {
    const { webStorage, currentURL, currentLocation } = feature

    const factory: DocumentFactory = {
        actions: {
            error: newErrorAction(),
            ...newDocumentOutlineAction(webStorage, currentLocation),

            content: initContentAction(),
        },
        components: {
            content: initContentComponent,
        },
    }
    const locationInfo: DocumentLocationInfo = {
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
