import { newResetInfra } from "../../../../init"

import { newCoreBackgroundPod } from "../common"

import { resetEventHasDone } from "../../../../impl"

import { WorkerHandler } from "../../../../../../../../../z_vendor/getto-application/action/worker/background"

import { CoreBackgroundInfra } from "../../Core/impl"

import { ResetPasswordProxyMessage, ResetPasswordProxyResponse } from "./message"

export function newResetPasswordHandler(
    post: Post<ResetPasswordProxyResponse>,
): WorkerHandler<ResetPasswordProxyMessage> {
    const pod = newCoreBackgroundPod()
    return (message) => {
        switch (message.method) {
            case "reset":
                pod.initReset({ getResetToken: () => message.params.resetToken })(
                    message.params.fields,
                    (event) => {
                        post({
                            ...message,
                            done: resetEventHasDone(event),
                            event,
                        })
                    },
                )
                return
        }
    }
}

export function newCoreBackgroundInfra(): CoreBackgroundInfra {
    return {
        reset: newResetInfra(),
    }
}

interface Post<R> {
    (response: R): void
}
