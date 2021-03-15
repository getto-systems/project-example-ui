import { docsMenuContent } from "../../outline/menu/kernel/init/docs"
import { newNotifyUnexpectedErrorResource } from "../../avail/action_notify_unexpected_error/init"
import { newLoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/init"
import { newLoadMenuResource } from "../../outline/menu/action_load_menu/init"

import { initDocsEntryPoint } from "./impl"

import { DocsContent, DocsEntryPoint } from "./entry_point"

type OutsideFeature = DocsContent &
    Readonly<{
        webStorage: Storage
        currentLocation: Location
    }>
export function newDocsEntryPoint(feature: OutsideFeature): DocsEntryPoint {
    const menu = docsMenuContent()
    return initDocsEntryPoint({
        ...newLoadBreadcrumbListResource(feature, menu),
        ...newLoadMenuResource(feature, menu),
        ...newNotifyUnexpectedErrorResource(feature),
        docs: feature.docs,
    })
}
