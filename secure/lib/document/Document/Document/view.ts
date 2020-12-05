import { MenuComponent } from "../../../common/Outline/menu/component"
import { BreadcrumbComponent } from "../../../common/Outline/breadcrumb/component"

import { ContentComponent } from "../content/component"

export interface DocumentFactory {
    (): DocumentEntryPoint
}
export type DocumentEntryPoint = Readonly<{
    components: DocumentComponent
    terminate: Terminate
}>

export type DocumentComponent = Readonly<{
    menu: MenuComponent
    breadcrumb: BreadcrumbComponent

    content: ContentComponent
}>

interface Terminate {
    (): void
}
