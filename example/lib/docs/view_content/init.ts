import { docsMenuContent } from "../../outline/menu/kernel/init/docs"
import { newNotifyUnexpectedErrorResource } from "../../avail/action_unexpected_error/init"
import { newLoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/init"
import { newLoadMenuResource } from "../../outline/menu/action_load_menu/init"
import { newLoadDocsContentPathResource } from "../action_load_content/init"

import { initDocsContentEntryPoint } from "./impl"

import { DocsContentEntryPoint } from "./entry_point"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newDocsContentEntryPoint(feature: OutsideFeature): DocsContentEntryPoint {
    const menu = docsMenuContent()
    return initDocsContentEntryPoint({
        ...newLoadBreadcrumbListResource(feature, menu),
        ...newLoadMenuResource(feature, menu),
        ...newNotifyUnexpectedErrorResource(feature),
        ...newLoadDocsContentPathResource(feature),
    })
}
