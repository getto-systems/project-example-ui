import { SeasonMaterial, SeasonComponent, SeasonState } from "./component"

export function initSeason(material: SeasonMaterial): SeasonComponent {
    return new Component(material)
}

class Component implements SeasonComponent {
    material: SeasonMaterial

    listener: Post<SeasonState>[] = []

    constructor(material: SeasonMaterial) {
        this.material = material
    }

    onStateChange(post: Post<SeasonState>): void {
        this.listener.push(post)
    }
    post(state: SeasonState): void {
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
