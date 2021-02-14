import { initBreadcrumbListComponent } from "./BreadcrumbList/impl"
import { initMenuComponent } from "./Menu/impl"

import { initBreadcrumbListAction, initMenuAction } from "../../../../auth/permission/menu/impl"

import { MenuForegroundActionPod, MenuLocationInfo, MenuResource } from "./resource"

import { BreadcrumbListMaterial } from "./BreadcrumbList/component"
import { MenuMaterial } from "./Menu/component"

export function initMenuResource(
    locationInfo: MenuLocationInfo,
    foreground: MenuForegroundActionPod
): MenuResource {
    return {
        breadcrumbList: initBreadcrumbListComponent(breadcrumbListMaterial()),
        menu: initMenuComponent(menuMaterial()),
    }

    function breadcrumbListMaterial(): BreadcrumbListMaterial {
        return {
            breadcrumbList: initBreadcrumbListAction(foreground.initBreadcrumbList, locationInfo),
        }
    }
    function menuMaterial(): MenuMaterial {
        return {
            menu: initMenuAction(foreground.initMenu, locationInfo),
        }
    }
}
