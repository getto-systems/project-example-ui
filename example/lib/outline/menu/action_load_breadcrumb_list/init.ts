import { newLoadMenuLocationDetecter } from "../kernel/impl/init"
import { newLoadBreadcrumbListInfra } from "../load_breadcrumb_list/init"

import { initLoadBreadcrumbListCoreAction, initLoadBreadcrumbListCoreMaterial } from "./core/impl"

import { MenuContent } from "../kernel/infra"

import { LoadBreadcrumbListResource } from "./resource"

type OutsideFeature = Readonly<{
    currentLocation: Location
}>
export function newLoadBreadcrumbListResource(
    feature: OutsideFeature,
    menuContent: MenuContent,
): LoadBreadcrumbListResource {
    const { currentLocation } = feature
    return {
        breadcrumbList: initLoadBreadcrumbListCoreAction(
            initLoadBreadcrumbListCoreMaterial(
                newLoadBreadcrumbListInfra(menuContent),
                newLoadMenuLocationDetecter(currentLocation),
            ),
        ),
    }
}
