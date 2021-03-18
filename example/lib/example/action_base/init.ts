import { homeMenuContent } from "../../outline/kernel/init/home"
import { newNotifyUnexpectedErrorResource } from "../../avail/action_notify_unexpected_error/init"
import { newLoadBreadcrumbListResource } from "../../outline/action_load_breadcrumb_list/init"
import { newLoadMenuResource } from "../../outline/action_load_menu/init"
import { newLoadSeasonResource } from "../common/action_load_season/init"

import { BaseResource } from "./resource"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newBaseResource(feature: OutsideFeature): BaseResource {
    const menu = homeMenuContent()
    return {
        ...newLoadBreadcrumbListResource(feature, menu),
        ...newLoadMenuResource(feature, menu),
        ...newNotifyUnexpectedErrorResource(feature),
        ...newLoadSeasonResource(feature),
    }
}
