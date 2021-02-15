import { initBreadcrumbListComponent } from "./BreadcrumbList/impl"
import { initMenuComponent } from "./Menu/impl"

import { MenuForegroundAction, MenuResource } from "./resource"

export function initMenuResource(foreground: MenuForegroundAction): MenuResource {
    return {
        breadcrumbList: initBreadcrumbListComponent(foreground),
        menu: initMenuComponent(foreground),
    }
}
