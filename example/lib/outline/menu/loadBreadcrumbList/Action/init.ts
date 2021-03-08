import { newLoadMenuLocationDetecter } from "../../kernel/init/location"
import { newLoadBreadcrumbListInfra } from "../init"

import { initLoadBreadcrumbListCoreAction, initLoadBreadcrumbListCoreMaterial } from "./Core/impl"

import { MenuContent } from "../../kernel/infra"

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
