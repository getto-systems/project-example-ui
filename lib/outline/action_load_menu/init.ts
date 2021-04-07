import { newLoadMenuLocationDetecter } from "../kernel/impl/init"
import { newLoadMenuInfra } from "../load_menu/impl/init"
import { newUpdateMenuBadgeInfra } from "../update_menu_badge/impl/init"
import { newToggleMenuExpandInfra } from "../toggle_menu_expand/impl/init"

import { initLoadMenuCoreAction, initLoadMenuCoreMaterial } from "./core/impl"

import { MenuContent } from "../kernel/infra"

import { LoadMenuResource } from "./resource"
import { RemoteOutsideFeature } from "../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryOutsideFeature } from "../../z_vendor/getto-application/infra/repository/infra"
import { LocationOutsideFeature } from "../../z_vendor/getto-application/location/infra"

export function newLoadMenuResource(
    feature: RemoteOutsideFeature & RepositoryOutsideFeature & LocationOutsideFeature,
    menuContent: MenuContent,
): LoadMenuResource {
    return {
        menu: initLoadMenuCoreAction(
            initLoadMenuCoreMaterial(
                {
                    ...newLoadMenuInfra(feature, menuContent),
                    ...newUpdateMenuBadgeInfra(feature, menuContent),
                    ...newToggleMenuExpandInfra(feature, menuContent),
                },
                newLoadMenuLocationDetecter(feature),
            ),
        ),
    }
}
