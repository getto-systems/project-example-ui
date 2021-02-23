import { RequestPasswordResetTokenAction, RequestPasswordResetTokenEntryPoint } from "../action"
import { newBoardValidateStack } from "../../../../../../../../z_getto/board/kernel/infra/stack"
import { initRequestPasswordResetTokenFormAction } from "../Form/impl"
import { RequestPasswordResetTokenFormAction } from "../Form/action"
import {
    initRequestPasswordResetTokenCoreAction,
    initRequestPasswordResetTokenCoreAction_merge,
    initRequestPasswordResetTokenCoreMaterial,
    RequestPasswordResetTokenCoreBase,
} from "../Core/impl"
import { newRequestPasswordResetTokenRemote } from "../../../infra/remote/requestToken/main"
import { delaySecond } from "../../../../../../../../z_getto/infra/config/infra"
import { delayed } from "../../../../../../../../z_getto/infra/delayed/core"
import {
    RequestPasswordResetTokenCoreAction,
    RequestPasswordResetTokenCoreMaterial,
} from "../Core/action"
import { toRequestPasswordResetTokenAction, toRequestPasswordResetTokenEntryPoint } from "../impl"

export function newRequestPasswordResetToken(): RequestPasswordResetTokenEntryPoint {
    return toRequestPasswordResetTokenEntryPoint(mergeAction(newCoreAction()))
}
export function newRequestPasswordResetToken_proxy(
    material: RequestPasswordResetTokenCoreMaterial,
): RequestPasswordResetTokenEntryPoint {
    return toRequestPasswordResetTokenEntryPoint(
        mergeAction(initRequestPasswordResetTokenCoreAction_merge(material)),
    )
}
function mergeAction(core: RequestPasswordResetTokenCoreAction): RequestPasswordResetTokenAction {
    return toRequestPasswordResetTokenAction({
        core,
        form: newFormAction(),
    })
}

export function newRequestPasswordResetTokenMaterial(): RequestPasswordResetTokenCoreMaterial {
    return initRequestPasswordResetTokenCoreMaterial(newBase())
}

function newCoreAction(): RequestPasswordResetTokenCoreAction {
    return initRequestPasswordResetTokenCoreAction(newBase())
}

function newBase(): RequestPasswordResetTokenCoreBase {
    return {
        request: {
            request: newRequestPasswordResetTokenRemote(),
            config: {
                delay: delaySecond(1),
            },
            delayed,
        },
    }
}

function newFormAction(): RequestPasswordResetTokenFormAction {
    return initRequestPasswordResetTokenFormAction({
        stack: newBoardValidateStack(),
    })
}
