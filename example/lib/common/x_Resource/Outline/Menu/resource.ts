import { BreadcrumbListComponent } from "./BreadcrumbList/component"
import { MenuComponent } from "./Menu/component"

import {
    BreadcrumbListActionPod,
    MenuActionLocationInfo,
    MenuActionPod,
} from "../../../../auth/permission/menu/action"

export type MenuResource = Readonly<{
    breadcrumbList: BreadcrumbListComponent
    menu: MenuComponent
}>

export type MenuLocationInfo = MenuActionLocationInfo
export type MenuForegroundActionPod = Readonly<{
    initBreadcrumbList: BreadcrumbListActionPod
    initMenu: MenuActionPod
}>
