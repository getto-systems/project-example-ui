import { ErrorComponentFactory, ErrorMaterial, ErrorComponent } from "./component"

export const initErrorComponent: ErrorComponentFactory = (material) => new Component(material)

class Component implements ErrorComponent {
    material: ErrorMaterial

    constructor(material: ErrorMaterial) {
        this.material = material
    }

    notify(err: unknown): void {
        this.material.notify(err)
    }
}
