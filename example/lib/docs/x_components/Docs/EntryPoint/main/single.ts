import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { initContentComponent } from "../../content/impl"

import { newNotifyUnexpectedErrorResource } from "../../../../../avail/unexpectedError/Action/init"

import { DocumentEntryPoint } from "../entryPoint"

import { initContentAction } from "../../../../content/main/content"
import { newDocumentOutlineAction } from "../../../../../auth/permission/outline/load/main/document"
import { newLoadContentLocationDetecter } from "../../../../content/init"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newForeground(feature: OutsideFeature): DocumentEntryPoint {
    const { webStorage, currentLocation } = feature

    const factory: DocumentFactory = {
        actions: {
            ...newDocumentOutlineAction(webStorage, currentLocation),

            content: initContentAction(),
        },
        components: {
            content: initContentComponent,
        },
    }
    const locationInfo: DocumentLocationInfo = {
        content: newLoadContentLocationDetecter(currentLocation),
    }
    const resource = initDocumentResource(
        factory,
        locationInfo,
        newNotifyUnexpectedErrorResource(webStorage),
    )
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
            resource.breadcrumbList.terminate()
            resource.content.terminate()
        },
    }
}
