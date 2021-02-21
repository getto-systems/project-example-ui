import { StartPasswordResetSessionAction, StartPasswordResetSessionEntryPoint } from "../action"
import { newBoardValidateStack } from "../../../../../../../../z_getto/board/kernel/infra/stack"
import { initStartPasswordResetSessionFormAction } from "../Form/impl"
import { StartPasswordResetSessionFormAction } from "../Form/action"
import {
    initStartPasswordResetSessionCoreAction,
    initStartPasswordResetSessionCoreAction_merge,
    initStartPasswordResetSessionCoreMaterial,
    StartPasswordResetSessionCoreBase,
} from "../Core/impl"
import { newStartPasswordResetSessionRemote } from "../../../infra/remote/start/main"
import { delaySecond, limit, waitSecond } from "../../../../../../../../z_getto/infra/config/infra"
import { delayed, wait } from "../../../../../../../../z_getto/infra/delayed/core"
import { newSendPasswordResetSessionTokenRemote } from "../../../infra/remote/sendToken/main"
import { newGetPasswordResetSessionStatusRemote } from "../../../infra/remote/getStatus/main"
import {
    StartPasswordResetSessionCoreAction,
    StartPasswordResetSessionCoreMaterial,
} from "../Core/action"
import { toStartPasswordResetSessionEntryPoint } from "../impl"

export function newStartPasswordResetSession(): StartPasswordResetSessionEntryPoint {
    return toStartPasswordResetSessionEntryPoint(mergeAction(newCoreAction()))
}
export function newStartPasswordResetSession_proxy(
    material: StartPasswordResetSessionCoreMaterial,
): StartPasswordResetSessionEntryPoint {
    return toStartPasswordResetSessionEntryPoint(
        mergeAction(initStartPasswordResetSessionCoreAction_merge(material)),
    )
}
function mergeAction(core: StartPasswordResetSessionCoreAction): StartPasswordResetSessionAction {
    return {
        core,
        form: newFormAction(),
    }
}

export function newStartPasswordResetSessionMaterial(): StartPasswordResetSessionCoreMaterial {
    return initStartPasswordResetSessionCoreMaterial(newBase())
}

function newCoreAction(): StartPasswordResetSessionCoreAction {
    return initStartPasswordResetSessionCoreAction(newBase())
}

function newBase(): StartPasswordResetSessionCoreBase {
    return {
        start: {
            start: newStartPasswordResetSessionRemote(),
            config: {
                delay: delaySecond(1),
            },
            delayed,
        },
        checkStatus: {
            sendToken: newSendPasswordResetSessionTokenRemote(),
            getStatus: newGetPasswordResetSessionStatusRemote(),
            config: {
                wait: waitSecond(0.25),
                limit: limit(40),
            },
            wait,
        },
    }
}

function newFormAction(): StartPasswordResetSessionFormAction {
    return initStartPasswordResetSessionFormAction({
        stack: newBoardValidateStack(),
    })
}
