import { docsMenuContent } from "../../outline/kernel/init/docs"
import { newNotifyUnexpectedErrorResource } from "../../avail/action_notify_unexpected_error/init"
import { newLoadBreadcrumbListResource } from "../../outline/action_load_breadcrumb_list/init"
import { newLoadMenuResource } from "../../outline/action_load_menu/init"

import { initDocsView } from "./impl"

import { DocsView } from "./resource"

export type DocsOutsideFeature = Readonly<{
    webDB: IDBFactory
    webCrypto: Crypto
    currentLocation: Location
}>
export function newDocsView(feature: DocsOutsideFeature): DocsView {
    const menu = docsMenuContent()
    return initDocsView({
        ...newLoadBreadcrumbListResource(feature, menu),
        ...newLoadMenuResource(feature, menu),
        ...newNotifyUnexpectedErrorResource(feature),
    })
}
