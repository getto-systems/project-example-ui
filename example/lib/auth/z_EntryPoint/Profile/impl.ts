import { ProfileFactory, ProfileLocationInfo, ProfileResource } from "./entryPoint"

import { initClearCredentialResource } from "../../x_Resource/Sign/ClearCredential/impl"

export function initProfileResource(
    factory: ProfileFactory,
    locationInfo: ProfileLocationInfo
): ProfileResource {
    const actions = {
        notify: factory.actions.notify.notify(),

        loadSeason: factory.actions.season.loadSeason(),

        loadBreadcrumb: factory.actions.menu.loadBreadcrumb(locationInfo.menu),
        loadMenu: factory.actions.menu.loadMenu(locationInfo.menu),
        toggleMenuExpand: factory.actions.menu.toggleMenuExpand(),
    }
    return {
        error: factory.components.error(actions),
        seasonInfo: factory.components.seasonInfo(actions),
        menuList: factory.components.menuList(actions),
        breadcrumbList: factory.components.breadcrumbList(actions),

        ...initClearCredentialResource(factory.actions),
    }
}
