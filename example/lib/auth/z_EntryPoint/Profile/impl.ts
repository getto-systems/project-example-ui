import { ProfileFactory, ProfileLocationInfo, ProfileResource } from "./entryPoint"

import { initClearCredentialResource } from "../../x_Resource/Sign/ClearCredential/impl"

import { ClearCredentialResource } from "../../x_Resource/Sign/ClearCredential/resource"

export function initProfileResource(
    factory: ProfileFactory,
    locationInfo: ProfileLocationInfo
): ProfileResource {
    const actions = {
        notify: factory.actions.notify.notify(),

        loadApiNonce: factory.actions.credential.loadApiNonce(),
        loadApiRoles: factory.actions.credential.loadApiRoles(),

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

        ...clearCredential(),
    }

    function clearCredential(): ClearCredentialResource {
        return initClearCredentialResource({
            logout: factory.actions.logout,
        })
    }
}
