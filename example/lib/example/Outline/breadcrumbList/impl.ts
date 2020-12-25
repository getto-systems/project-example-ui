import { BreadcrumbListMaterial, BreadcrumbListComponent, BreadcrumbListState } from "./component"

export function initBreadcrumb(material: BreadcrumbListMaterial): BreadcrumbListComponent {
    return new Component(material)
}

class Component implements BreadcrumbListComponent {
    material: BreadcrumbListMaterial

    listener: Post<BreadcrumbListState>[] = []

    constructor(material: BreadcrumbListMaterial) {
        this.material = material
    }

    onStateChange(post: Post<BreadcrumbListState>): void {
        this.listener.push(post)
    }
    post(state: BreadcrumbListState): void {
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
