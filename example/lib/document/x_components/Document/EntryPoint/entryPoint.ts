import { NotifyComponent } from "../../../../availability/x_Resource/NotifyError/Notify/component"
import { MenuListComponent } from "../../../../auth/z_EntryPoint/Outline/menuList/component"
import { BreadcrumbListComponent } from "../../../../auth/z_EntryPoint/Outline/breadcrumbList/component"

import { ContentComponent } from "../content/component"

export type DocumentEntryPoint = Readonly<{
    resource: DocumentResource
    terminate: Terminate
}>

export type DocumentResource = Readonly<{
    error: NotifyComponent
    menuList: MenuListComponent
    breadcrumbList: BreadcrumbListComponent

    content: ContentComponent
}>

interface Terminate {
    (): void
}
