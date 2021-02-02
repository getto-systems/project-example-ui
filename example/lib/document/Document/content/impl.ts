import { ApplicationBaseComponent } from "../../../sub/getto-example/application/impl"

import { ContentComponentFactory, ContentMaterial, ContentComponent, ContentState } from "./component"

export const initContentComponent: ContentComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<ContentState> implements ContentComponent {
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
