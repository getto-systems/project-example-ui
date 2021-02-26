import { ApplicationAbstractStateAction } from "../../../../../../../../z_getto/action/impl"
import { clear } from "../../../impl"
import { ClearInfra } from "../../../infra"

import { CoreAction, CoreMaterial, CoreState } from "./action"

export function initCoreMaterial(infra: ClearInfra): CoreMaterial {
    return {
        clear: clear(infra),
    }
}

export function initCoreAction(material: CoreMaterial): CoreAction {
    return new Action(material)
}

class Action extends ApplicationAbstractStateAction<CoreState> implements CoreAction {
    readonly initialState: CoreState = { type: "initial-logout" }

    material: CoreMaterial

    constructor(material: CoreMaterial) {
        super()
        this.material = material
    }

    submit(): void {
        this.material.clear(this.post)
    }
}
