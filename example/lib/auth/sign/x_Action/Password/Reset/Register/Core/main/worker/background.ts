import { newRegisterPasswordResetSessionBackgroundMaterial } from "../core"

import { registerPasswordResetSessionEventHasDone } from "../../../../../../../password/resetSession/register/impl"

import { WorkerHandler } from "../../../../../../../../../common/vendor/getto-worker/main/background"

import {
    RegisterPasswordResetSessionProxyMessage,
    RegisterPasswordResetSessionProxyResponse,
} from "./message"

export function newRegisterPasswordResetSessionHandler(
    post: Post<RegisterPasswordResetSessionProxyResponse>
): WorkerHandler<RegisterPasswordResetSessionProxyMessage> {
    const material = newRegisterPasswordResetSessionBackgroundMaterial()
    return (message) => {
        switch (message.method) {
            case "register":
                material.register(message.params.fields, (event) => {
                    post({
                        ...message,
                        done: registerPasswordResetSessionEventHasDone(event),
                        event,
                    })
                })
                return
        }
    }
}

interface Post<R> {
    (response: R): void
}
