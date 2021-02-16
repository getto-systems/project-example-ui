import { newAuthenticatePasswordHandler } from "../../../../../../../sign/x_Action/Password/Authenticate/Core/main/worker/background"

import { WorkerHandler } from "../../../../../../../../common/vendor/getto-worker/main/background"

import {
    AuthSignPasswordAuthenticateProxyMessage,
    AuthSignPasswordAuthenticateProxyResponse,
} from "./message"

export function newAuthSignPasswordAuthenticateHandler(
    post: Post<AuthSignPasswordAuthenticateProxyResponse>
): WorkerHandler<AuthSignPasswordAuthenticateProxyMessage> {
    const handler = {
        authenticate: newAuthenticatePasswordHandler((response) => {
            post({ type: "authenticate", response })
        }),
    }
    return (message) => {
        switch (message.type) {
            case "authenticate":
                handler.authenticate(message.message)
                return
        }
    }
}

interface Post<R> {
    (response: R): void
}
