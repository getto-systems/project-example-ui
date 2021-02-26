import { ApplicationAbstractStateAction } from "../../../../z_vendor/getto-application/action/impl"

import {
    SeasonInfoComponentFactory,
    SeasonInfoMaterial,
    SeasonInfoComponent,
    SeasonInfoComponentState,
} from "./component"

export const initSeasonInfoComponent: SeasonInfoComponentFactory = (material) =>
    new Component(material)

class Component
    extends ApplicationAbstractStateAction<SeasonInfoComponentState>
    implements SeasonInfoComponent {
    readonly initialState: SeasonInfoComponentState = { type: "initial-season" }

    material: SeasonInfoMaterial

    constructor(material: SeasonInfoMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.loadSeason(this.post)
        })
    }
}
