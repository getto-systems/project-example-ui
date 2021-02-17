import { newGetPasswordResetSessionStatusRemote } from "../../../../../../password/resetSession/start/infra/remote/getStatus/main"
import { newSendPasswordResetSessionTokenRemote } from "../../../../../../password/resetSession/start/infra/remote/sendToken/main"
import { newStartPasswordResetSessionRemote } from "../../../../../../password/resetSession/start/infra/remote/start/main"

import { delayed, wait } from "../../../../../../../../z_infra/delayed/core"

import {
    initStartPasswordResetSessionAction,
    initStartPasswordResetSessionAction_merge,
    initStartPasswordResetSessionMaterial,
    StartPasswordResetSessionBase,
} from "../impl"

import { delaySecond, limit, waitSecond } from "../../../../../../../../z_infra/time/infra"

import { StartPasswordResetSessionAction, StartPasswordResetSessionMaterial } from "../action"

export function newStartPasswordResetSessionAction(): StartPasswordResetSessionAction {
    return initStartPasswordResetSessionAction(newBase())
}
export function newStartPasswordResetSessionAction_merge(
    material: StartPasswordResetSessionMaterial
): StartPasswordResetSessionAction {
    return initStartPasswordResetSessionAction_merge(material)
}
export function newStartPasswordResetSessionMaterial(): StartPasswordResetSessionMaterial {
    return initStartPasswordResetSessionMaterial(newBase())
}

function newBase(): StartPasswordResetSessionBase {
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
