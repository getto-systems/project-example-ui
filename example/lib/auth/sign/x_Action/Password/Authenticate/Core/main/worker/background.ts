import { newAuthenticatePasswordBackground } from "../core"

import { authenticatePasswordEventHasDone } from "../../../../../../password/authenticate/impl"

import { WorkerHandler } from "../../../../../../../../common/vendor/getto-worker/main/background"

import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "./message"

export function newAuthenticatePasswordHandler(
    post: Post<AuthenticatePasswordProxyResponse>
): WorkerHandler<AuthenticatePasswordProxyMessage> {
    const material = newAuthenticatePasswordBackground()
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
