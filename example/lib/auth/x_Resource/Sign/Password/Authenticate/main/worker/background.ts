import { newAuthenticatePasswordHandler } from "../../../../../../sign/x_Action/Password/Authenticate/Core/main/worker/background"

import { WorkerHandler } from "../../../../../../../common/vendor/getto-worker/main/background"

import {
    AuthenticatePasswordResourceProxyMessage,
    AuthenticatePasswordResourceProxyResponse,
} from "./message"

export function newAuthenticatePasswordResourceHandler(
    post: Post<AuthenticatePasswordResourceProxyResponse>
): WorkerHandler<AuthenticatePasswordResourceProxyMessage> {
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
