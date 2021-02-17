import { ApplicationAbstractAction } from "../../../../common/vendor/getto-example/Application/impl"

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
