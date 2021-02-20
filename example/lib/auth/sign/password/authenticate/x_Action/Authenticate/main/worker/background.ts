import { newAuthenticatePasswordCoreBackground } from "../core"

import { authenticatePasswordEventHasDone } from "../../../../impl"

import { WorkerHandler } from "../../../../../../../../z_getto/application/worker/background"

import { AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse } from "./message"

export function newAuthenticatePasswordHandler(
    post: Post<AuthenticatePasswordProxyResponse>
): WorkerHandler<AuthenticatePasswordProxyMessage> {
    const material = newAuthenticatePasswordCoreBackground()
    return (message) => {
        switch (message.method) {
            case "authenticate":
                material.authenticate(message.params.fields, (event) => {
                    post({
                        ...message,
                        done: authenticatePasswordEventHasDone(event),
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
