import { newResetPasswordInfra } from "../../../impl/init"

import { newCoreBackgroundPod } from "../common"

import { resetPasswordEventHasDone } from "../../../impl/core"

import { WorkerHandler } from "../../../../../../../../z_vendor/getto-application/action/worker/background"

import { ResetPasswordCoreBackgroundInfra } from "../../Core/impl"

import { ResetPasswordProxyMessage, ResetPasswordProxyResponse } from "./message"
import { backgroundLocationDetecter } from "../../../../../../../../z_vendor/getto-application/location/helper"

export function newResetPasswordHandler(
    post: Post<ResetPasswordProxyResponse>,
): WorkerHandler<ResetPasswordProxyMessage> {
    const pod = newCoreBackgroundPod()
    return (message) => {
        switch (message.method) {
            case "reset":
                pod.initReset(backgroundLocationDetecter(message.params.resetToken))(
                    message.params.fields,
                    (event) => {
                        post({
                            ...message,
                            done: resetPasswordEventHasDone(event),
                            event,
                        })
                    },
                )
                return
        }
    }
}

export function newCoreBackgroundInfra(): ResetPasswordCoreBackgroundInfra {
    return {
        reset: newResetPasswordInfra(),
    }
}

interface Post<R> {
    (response: R): void
}
