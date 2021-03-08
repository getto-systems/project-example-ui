import { DocumentLocationInfo, DocumentFactory, initDocumentResource } from "../impl/core"

import { initContentComponent } from "../../content/impl"

import { newNotifyUnexpectedErrorResource } from "../../../../../avail/action_unexpected_error/init"

import { DocumentEntryPoint } from "../entryPoint"

import { initContentAction } from "../../../../content/main/content"
import { newLoadContentLocationDetecter } from "../../../../content/init"
import { newLoadBreadcrumbListResource } from "../../../../../outline/menu/action_load_breadcrumb_list/init"
import { docsMenuContent } from "../../../../../outline/menu/kernel/init/docs"
import { newLoadMenuResource } from "../../../../../outline/menu/action_load_menu/init"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newForeground(feature: OutsideFeature): DocumentEntryPoint {
    const { currentLocation } = feature
    const menu = docsMenuContent()

    const factory: DocumentFactory = {
        actions: {
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
        newLoadBreadcrumbListResource(feature, menu),
        newLoadMenuResource(feature, menu),
        newNotifyUnexpectedErrorResource(feature),
    )
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
            resource.content.terminate()
        },
    }
}
