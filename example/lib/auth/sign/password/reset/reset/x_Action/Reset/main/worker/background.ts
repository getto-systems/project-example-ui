import { newResetPasswordBackgroundPod } from "../core"

import { resetPasswordEventHasDone } from "../../../../impl"

import { WorkerHandler } from "../../../../../../../../../z_getto/application/worker/background"

import { ResetPasswordProxyMessage, ResetPasswordProxyResponse } from "./message"

export function newResetPasswordHandler(
    post: Post<ResetPasswordProxyResponse>,
): WorkerHandler<ResetPasswordProxyMessage> {
    const pod = newResetPasswordBackgroundPod()
    return (message) => {
        switch (message.method) {
            case "reset":
                pod.initReset({ getPasswordResetToken: () => message.params.resetToken })(
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

interface Post<R> {
    (response: R): void
}
