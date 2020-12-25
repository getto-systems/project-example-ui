import { SeasonInfoMaterial, SeasonInfoComponent, SeasonInfoState } from "./component"

export function initSeason(material: SeasonInfoMaterial): SeasonInfoComponent {
    return new Component(material)
}

class Component implements SeasonInfoComponent {
    material: SeasonInfoMaterial

    listener: Post<SeasonInfoState>[] = []

    constructor(material: SeasonInfoMaterial) {
        this.material = material
    }

    onStateChange(post: Post<SeasonInfoState>): void {
        this.listener.push(post)
    }
    post(state: SeasonInfoState): void {
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
