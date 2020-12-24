import { MenuComponent } from "../../../example/shared/Outline/menu/component"
import { BreadcrumbComponent } from "../../../example/shared/Outline/breadcrumb/component"

import { ContentComponent } from "../content/component"

export type DocumentEntryPoint = Readonly<{
    resource: DocumentResource
    terminate: Terminate
}>

export type DocumentResource = Readonly<{
    menu: MenuComponent
    breadcrumb: BreadcrumbComponent

    content: ContentComponent
}>

interface Terminate {
    (): void
}
