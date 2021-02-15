import { BreadcrumbListComponent } from "./BreadcrumbList/component"
import { MenuComponent } from "./Menu/component"

import { BreadcrumbListAction, MenuAction } from "../../../../auth/permission/outline/action"

export type MenuResource = Readonly<{
    breadcrumbList: BreadcrumbListComponent
    menu: MenuComponent
}>

export type MenuForegroundAction = Readonly<{
    breadcrumbList: BreadcrumbListAction
    menu: MenuAction
}>
