import { MenuComponent } from "../../System/component/menu/component"
import { BreadcrumbComponent } from "../../System/component/breadcrumb/component"

import { ContentComponent } from "../component/content/component"

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
