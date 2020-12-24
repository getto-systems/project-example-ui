import { BreadcrumbMaterial, BreadcrumbComponent, BreadcrumbState } from "./component"

export function initBreadcrumb(material: BreadcrumbMaterial): BreadcrumbComponent {
    return new Component(material)
}

class Component implements BreadcrumbComponent {
    material: BreadcrumbMaterial

    listener: Post<BreadcrumbState>[] = []

    constructor(material: BreadcrumbMaterial) {
        this.material = material
    }

    onStateChange(post: Post<BreadcrumbState>): void {
        this.listener.push(post)
    }
    post(state: BreadcrumbState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        this.material.loadBreadcrumb((event) => {
            this.post(event)
        })
    }
}

interface Post<T> {
    (state: T): void
}
