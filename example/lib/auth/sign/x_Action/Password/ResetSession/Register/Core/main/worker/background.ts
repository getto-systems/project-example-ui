import { newRegisterPasswordBackground } from "../core"

import { registerPasswordEventHasDone } from "../../../../../../../password/resetSession/register/impl"

import { WorkerHandler } from "../../../../../../../../../z_getto/worker/background"

import { RegisterPasswordProxyMessage, RegisterPasswordProxyResponse } from "./message"

export function newRegisterPasswordHandler(
    post: Post<RegisterPasswordProxyResponse>
): WorkerHandler<RegisterPasswordProxyMessage> {
    const material = newRegisterPasswordBackground()
    return (message) => {
        switch (message.method) {
            case "register":
                material.register(message.params.fields, (event) => {
                    post({
                        ...message,
                        done: registerPasswordEventHasDone(event),
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
