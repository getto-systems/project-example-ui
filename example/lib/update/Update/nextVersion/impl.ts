import {
    NextVersionComponentFactory,
    NextVersionMaterial,
    NextVersionComponent,
    NextVersionState,
} from "./component"

export const initNextVersionComponent: NextVersionComponentFactory = (material) =>
    new Component(material)

class Component implements NextVersionComponent {
    material: NextVersionMaterial

    listener: Post<NextVersionState>[] = []

    constructor(material: NextVersionMaterial) {
        this.material = material
    }

    onStateChange(post: Post<NextVersionState>): void {
        this.listener.push(post)
    }
    post(state: NextVersionState): void {
        this.listener.forEach((post) => post(state))
    }

    find(): void {
        this.material.find((event) => {
            this.post(event)
        })
    }
}

interface Post<T> {
    (state: T): void
}
