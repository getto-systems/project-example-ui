import { ApplicationAbstractStateAction } from "../../../../z_vendor/getto-application/action/impl"
import { loadSeason } from "../../load_season/impl/core"

import { LoadSeasonInfra } from "../../load_season/infra"

import {
    initialLoadSeasonCoreState,
    LoadSeasonCoreAction,
    LoadSeasonCoreMaterial,
    LoadSeasonCoreState,
} from "./action"

export function initLoadSeasonCoreAction(infra: LoadSeasonInfra): LoadSeasonCoreAction {
    return new Action({
        loadSeason: loadSeason(infra),
    })
}

class Action extends ApplicationAbstractStateAction<LoadSeasonCoreState> {
    initialState = initialLoadSeasonCoreState

    material: LoadSeasonCoreMaterial

    constructor(material: LoadSeasonCoreMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.loadSeason(this.post)
        })
    }
}
