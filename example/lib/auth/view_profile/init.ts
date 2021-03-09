import { newNotifyUnexpectedErrorResource } from "../../avail/action_unexpected_error/init"
import { newLogoutResource } from "../sign/kernel/auth_info/action_logout/init"

import { initProfileEntryPoint } from "./impl"

import { ProfileEntryPoint } from "./entryPoint"
import { newLoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/init"
import { newLoadMenuResource } from "../../outline/menu/action_load_menu/init"
import { homeMenuContent } from "../../outline/menu/kernel/init/home"
import { newLoadSeasonResource } from "../../example/common/action_load_season/init"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newProfileEntryPoint(feature: OutsideFeature): ProfileEntryPoint {
    const menu = homeMenuContent()
    return initProfileEntryPoint({
        ...newNotifyUnexpectedErrorResource(feature),
        ...newLoadBreadcrumbListResource(feature, menu),
        ...newLoadMenuResource(feature, menu),
        ...newLoadSeasonResource(feature),
        ...newLogoutResource(feature),
    })
}
