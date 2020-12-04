import { MenuComponent } from "../../../common/Outline/menu/component"
import { BreadcrumbComponent } from "../../../common/Outline/breadcrumb/component"

import { ContentComponent } from "../content/component"

export interface DocumentFactory {
    (): DocumentResource
}
export type DocumentResource = Readonly<{
    components: DocumentComponentSet
    terminate: Terminate
}>

export type DocumentComponentSet = Readonly<{
    menu: MenuComponent
    breadcrumb: BreadcrumbComponent

    content: ContentComponent
}>

interface Terminate {
    (): void
}
