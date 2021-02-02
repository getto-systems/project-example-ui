import { ApplicationBaseComponent } from "../../../sub/getto-example/application/impl"

import {
    SeasonInfoComponentFactory,
    SeasonInfoMaterial,
    SeasonInfoComponent,
    SeasonInfoState,
} from "./component"

export const initSeasonInfoComponent: SeasonInfoComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<SeasonInfoState> implements SeasonInfoComponent {
    material: SeasonInfoMaterial

    constructor(material: SeasonInfoMaterial) {
        super()
        this.material = material
    }

    load(): void {
        this.material.loadSeason((event) => {
            this.post(event)
        })
    }
}
