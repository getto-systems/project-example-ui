import { ErrorComponent } from "../../../../available/x_components/Error/error/component"
import { MenuListComponent } from "../../../../auth/x_components/Outline/menuList/component"
import { BreadcrumbListComponent } from "../../../../auth/x_components/Outline/breadcrumbList/component"

import { ContentComponent } from "../content/component"

export type DocumentEntryPoint = Readonly<{
    resource: DocumentResource
    terminate: Terminate
}>

export type DocumentResource = Readonly<{
    error: ErrorComponent
    menuList: MenuListComponent
    breadcrumbList: BreadcrumbListComponent

    content: ContentComponent
}>

interface Terminate {
    (): void
}
