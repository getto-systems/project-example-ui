import { newRegisterPasswordResetSessionHandler } from "../../../../../../../../sign/x_Action/Password/Reset/Register/Core/main/worker/background"

import { WorkerHandler } from "../../../../../../../../../common/vendor/getto-worker/main/background"

import {
    AuthSignPasswordResetSessionRegisterProxyMessage,
    AuthSignPasswordResetSessionRegisterProxyResponse,
} from "./message"

export function newAuthSignPasswordResetSessionRegisterHandler(
    post: Post<AuthSignPasswordResetSessionRegisterProxyResponse>
): WorkerHandler<AuthSignPasswordResetSessionRegisterProxyMessage> {
    const handler = {
        register: newRegisterPasswordResetSessionHandler((response) => {
            post({ type: "register", response })
        }),
    }
    return (message) => {
        switch (message.type) {
            case "register":
                handler.register(message.message)
                return
        }
    }
}

interface Post<R> {
    (response: R): void
}
