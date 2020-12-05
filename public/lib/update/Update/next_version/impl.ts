import { NextVersionMaterial, NextVersionComponent, NextVersionState } from "./component"

import { FindEvent } from "../../next_version/data"

export function initNextVersion(material: NextVersionMaterial): NextVersionComponent {
    return new Component(material)
}

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
            this.post(this.mapFindEvent(event))
        })
    }

    mapFindEvent(event: FindEvent): NextVersionState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
