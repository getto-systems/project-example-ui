import { ExampleMaterial, ExampleComponent, ExampleState, ExampleComponentFactory } from "./component"

export const initExample: ExampleComponentFactory = (material) => new Component(material)

class Component implements ExampleComponent {
    material: ExampleMaterial

    listener: Post<ExampleState>[] = []

    constructor(material: ExampleMaterial) {
        this.material = material
    }

    onStateChange(post: Post<ExampleState>): void {
        this.listener.push(post)
    }
    post(state: ExampleState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        this.material.loadSeason((event) => {
            this.post(event)
        })
    }
}

interface Post<T> {
    (state: T): void
}
