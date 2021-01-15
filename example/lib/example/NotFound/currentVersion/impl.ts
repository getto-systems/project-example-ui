import {
    CurrentVersionMaterial,
    CurrentVersionComponent,
    CurrentVersionState,
    CurrentVersionComponentFactory,
} from "./component"

export const initCurrentVersionComponent: CurrentVersionComponentFactory = (material) =>
    new Component(material)

class Component implements CurrentVersionComponent {
    material: CurrentVersionMaterial

    listener: Post<CurrentVersionState>[] = []

    constructor(material: CurrentVersionMaterial) {
        this.material = material
    }

    onStateChange(post: Post<CurrentVersionState>): void {
        this.listener.push(post)
    }
    post(state: CurrentVersionState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        this.material.findCurrentVersion((event) => {
            this.post(event)
        })
    }
}

interface Post<T> {
    (state: T): void
}
