import { MenuListComponent } from "../../../example/Outline/menuList/component"
import { BreadcrumbListComponent } from "../../../example/Outline/breadcrumbList/component"

import { ContentComponent } from "../content/component"

export type DocumentEntryPoint = Readonly<{
    resource: DocumentResource
    terminate: Terminate
}>

export type DocumentResource = Readonly<{
    menu: MenuListComponent
    breadcrumb: BreadcrumbListComponent

    content: ContentComponent
}>

interface Terminate {
    (): void
}
