import { MenuListComponent } from "../../../auth/Outline/menuList/component"
import { BreadcrumbListComponent } from "../../../auth/Outline/breadcrumbList/component"

import { ContentComponent } from "../content/component"

export type DocumentEntryPoint = Readonly<{
    resource: DocumentResource
    terminate: Terminate
}>

export type DocumentResource = Readonly<{
    menuList: MenuListComponent
    breadcrumbList: BreadcrumbListComponent

    content: ContentComponent
}>

interface Terminate {
    (): void
}
