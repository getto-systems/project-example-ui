import { ApplicationAbstractStateAction } from "../../../../../../../../z_getto/application/impl"

import { requestToken } from "../../../impl"

import { RequestTokenInfra } from "../../../infra"

import { CoreMaterial, CoreAction, CoreState } from "./action"

import { RequestTokenFields } from "../../../data"
import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"

export function initCoreMaterial(infra: RequestTokenInfra): CoreMaterial {
    return {
        requestToken: requestToken(infra),
    }
}

export function initCoreAction(material: CoreMaterial): CoreAction {
    return new Action(material)
}

class Action extends ApplicationAbstractStateAction<CoreState> implements CoreAction {
    material: CoreMaterial

    constructor(material: CoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: BoardConvertResult<RequestTokenFields>): void {
        this.material.requestToken(fields, this.post)
    }
}
