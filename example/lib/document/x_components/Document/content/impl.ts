import { ApplicationAbstractAction } from "../../../../z_getto/application/impl"

import { ContentComponentFactory, ContentMaterial, ContentComponent, ContentComponentState } from "./component"

export const initContentComponent: ContentComponentFactory = (material) => new Component(material)

class Component extends ApplicationAbstractAction<ContentComponentState> implements ContentComponent {
    material: ContentMaterial

    constructor(material: ContentMaterial) {
        super()        
        this.material = material
    }

    load(): void {
        this.material.loadDocument((event) => {
            this.post(event)
        })
    }
}
