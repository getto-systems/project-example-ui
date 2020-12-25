import { ContentComponentFactory, ContentMaterial, ContentComponent, ContentState } from "./component"

export const initContentComponent: ContentComponentFactory = (material) => new Component(material)

class Component implements ContentComponent {
    material: ContentMaterial

    listener: Post<ContentState>[] = []

    constructor(material: ContentMaterial) {
        this.material = material
    }

    onStateChange(post: Post<ContentState>): void {
        this.listener.push(post)
    }
    post(state: ContentState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        this.material.loadDocument((event) => {
            this.post(event)
        })
    }
}

interface Post<T> {
    (state: T): void
}
