import { ApplicationAbstractStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"

import { requestResetToken } from "../../impl/core"

import { RequestResetTokenInfra } from "../../infra"

import {
    RequestResetTokenCoreMaterial,
    RequestResetTokenCoreAction,
    RequestResetTokenCoreState,
    initialRequestResetTokenCoreState,
} from "./action"

import { RequestResetTokenFields } from "../../data"
import { ConvertBoardResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"

export function initRequestResetTokenCoreMaterial(
    infra: RequestResetTokenInfra,
): RequestResetTokenCoreMaterial {
    return {
        requestToken: requestResetToken(infra),
    }
}

export function initRequestResetTokenCoreAction(
    material: RequestResetTokenCoreMaterial,
): RequestResetTokenCoreAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<RequestResetTokenCoreState>
    implements RequestResetTokenCoreAction {
    readonly initialState = initialRequestResetTokenCoreState

    material: RequestResetTokenCoreMaterial

    constructor(material: RequestResetTokenCoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: ConvertBoardResult<RequestResetTokenFields>): void {
        this.material.requestToken(fields, this.post)
    }
}
