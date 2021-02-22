import { newRegisterPasswordBackgroundPod } from "../core"

import { registerPasswordEventHasDone } from "../../../../impl"

import { WorkerHandler } from "../../../../../../../../../z_getto/application/worker/background"

import { RegisterPasswordProxyMessage, RegisterPasswordProxyResponse } from "./message"

export function newRegisterPasswordHandler(
    post: Post<RegisterPasswordProxyResponse>,
): WorkerHandler<RegisterPasswordProxyMessage> {
    const pod = newRegisterPasswordBackgroundPod()
    return (message) => {
        switch (message.method) {
            case "register":
                pod.initRegister({ getPasswordResetToken: () => message.params.resetToken })(
                    message.params.fields,
                    (event) => {
                        post({
                            ...message,
                            done: registerPasswordEventHasDone(event),
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
