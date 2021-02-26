import { ApplicationAbstractStateAction } from "../../../../../../../../z_vendor/getto-application/action/impl"

import { requestToken } from "../../../impl"

import { RequestTokenInfra } from "../../../infra"

import { CoreMaterial, CoreAction, CoreState } from "./action"

import { RequestTokenFields } from "../../../data"
import { BoardConvertResult } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"

export function initCoreMaterial(infra: RequestTokenInfra): CoreMaterial {
    return {
        requestToken: requestToken(infra),
    }
}

export function initCoreAction(material: CoreMaterial): CoreAction {
    return new Action(material)
}

class Action extends ApplicationAbstractStateAction<CoreState> implements CoreAction {
    readonly initialState: CoreState = { type: "initial-request-token" }

    material: CoreMaterial

    constructor(material: CoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: BoardConvertResult<RequestTokenFields>): void {
        this.material.requestToken(fields, this.post)
    }
}
