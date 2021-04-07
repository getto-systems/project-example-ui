import { newLoadMenuLocationDetecter } from "../kernel/impl/init"
import { newLoadMenuInfra } from "../load_menu/impl/init"
import { newUpdateMenuBadgeInfra } from "../update_menu_badge/impl/init"
import { newToggleMenuExpandInfra } from "../toggle_menu_expand/impl/init"

import { initLoadMenuCoreAction, initLoadMenuCoreMaterial } from "./core/impl"

import { MenuContent } from "../kernel/infra"

import { LoadMenuResource } from "./resource"

type OutsideFeature = Readonly<{
    webDB: IDBFactory
    webCrypto: Crypto
    currentLocation: Location
}>
export function newLoadMenuResource(
    feature: OutsideFeature,
    menuContent: MenuContent,
): LoadMenuResource {
    const { webDB, webCrypto, currentLocation } = feature
    return {
        menu: initLoadMenuCoreAction(
            initLoadMenuCoreMaterial(
                {
                    ...newLoadMenuInfra(webDB, menuContent),
                    ...newUpdateMenuBadgeInfra(webDB, webCrypto, menuContent),
                    ...newToggleMenuExpandInfra(webDB, menuContent),
                },
                newLoadMenuLocationDetecter(currentLocation),
            ),
        ),
    }
}
