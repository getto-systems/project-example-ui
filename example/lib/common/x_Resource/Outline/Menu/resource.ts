import { BreadcrumbListComponent } from "./BreadcrumbList/component"
import { MenuComponent } from "./Menu/component"

import { LoadOutlineBreadcrumbListAction, LoadOutlineMenuAction } from "../../../../auth/permission/outline/load/action"

export type MenuResource = Readonly<{
    breadcrumbList: BreadcrumbListComponent
    menu: MenuComponent
}>

export type MenuForegroundAction = Readonly<{
    breadcrumbList: LoadOutlineBreadcrumbListAction
    menu: LoadOutlineMenuAction
}>
