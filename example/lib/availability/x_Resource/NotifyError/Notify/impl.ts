import { NotifyComponentFactory, NotifyMaterial, NotifyComponent } from "./component"

export const initNotifyComponent: NotifyComponentFactory = (material) => new Component(material)

class Component implements NotifyComponent {
    material: NotifyMaterial

    constructor(material: NotifyMaterial) {
        this.material = material
    }

    send(err: unknown): void {
        this.material.notify(err)
    }
}
