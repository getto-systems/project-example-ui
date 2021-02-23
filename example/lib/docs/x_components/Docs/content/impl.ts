import { ApplicationAbstractStateAction } from "../../../../z_getto/application/impl"

import {
    ContentComponentFactory,
    ContentMaterial,
    ContentComponent,
    ContentComponentState,
} from "./component"

export const initContentComponent: ContentComponentFactory = (material) => new Component(material)

class Component
    extends ApplicationAbstractStateAction<ContentComponentState>
    implements ContentComponent {
    material: ContentMaterial

    constructor(material: ContentMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.loadDocument(this.post)
        })
    }
}
