import { newLoadMenuLocationDetecter } from "../../kernel/init/location"
import { newLoadMenuInfra } from "../impl/init"
import { newUpdateMenuBadgeInfra } from "../../updateMenuBadge/impl/init"
import { newToggleMenuExpandInfra } from "../../toggleMenuExpand/impl/init"

import { initLoadMenuCoreAction, initLoadMenuCoreMaterial } from "./Core/impl"

import { MenuContent } from "../../kernel/infra"

import { LoadMenuResource } from "./resource"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newLoadMenuResource(
    feature: OutsideFeature,
    menuContent: MenuContent,
): LoadMenuResource {
    const { webStorage, currentLocation } = feature
    return {
        menu: initLoadMenuCoreAction(
            initLoadMenuCoreMaterial(
                {
                    ...newLoadMenuInfra(webStorage, menuContent),
                    ...newUpdateMenuBadgeInfra(webStorage),
                    ...newToggleMenuExpandInfra(webStorage, menuContent),
                },
                newLoadMenuLocationDetecter(currentLocation),
            ),
        ),
    }
}
