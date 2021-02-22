import { ApplicationAbstractAction } from "../../../../../../../../z_getto/application/impl"

import { requestPasswordResetToken } from "../../../impl"

import { RequestPasswordResetTokenInfra } from "../../../infra"

import {
    RequestPasswordResetTokenCoreMaterial,
    RequestPasswordResetTokenCoreAction,
    RequestPasswordResetTokenCoreState,
} from "./action"

import { PasswordResetRequestFields } from "../../../data"
import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"

export type RequestPasswordResetTokenCoreBase = Readonly<{
    request: RequestPasswordResetTokenInfra
}>

export function initRequestPasswordResetTokenCoreAction(
    base: RequestPasswordResetTokenCoreBase,
): RequestPasswordResetTokenCoreAction {
    return initRequestPasswordResetTokenCoreAction_merge(
        initRequestPasswordResetTokenCoreMaterial(base),
    )
}
export function initRequestPasswordResetTokenCoreAction_merge(
    material: RequestPasswordResetTokenCoreMaterial,
): RequestPasswordResetTokenCoreAction {
    return new Action(material)
}
export function initRequestPasswordResetTokenCoreMaterial(
    base: RequestPasswordResetTokenCoreBase,
): RequestPasswordResetTokenCoreMaterial {
    return {
        request: requestPasswordResetToken(base.request),
    }
}

class Action
    extends ApplicationAbstractAction<RequestPasswordResetTokenCoreState>
    implements RequestPasswordResetTokenCoreAction {
    material: RequestPasswordResetTokenCoreMaterial

    constructor(material: RequestPasswordResetTokenCoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: BoardConvertResult<PasswordResetRequestFields>): void {
        this.material.request(fields, this.post)
    }
}
