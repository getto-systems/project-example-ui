import { newRegisterPasswordHandler } from "../../../../../../../sign/x_Action/Password/ResetSession/Register/Core/main/worker/background"

import { WorkerHandler } from "../../../../../../../../z_vendor/getto-worker/background"

import {
    RegisterPasswordResourceProxyMessage,
    RegisterPasswordResourceProxyResponse,
} from "./message"

export function newRegisterPasswordResourceHandler(
    post: Post<RegisterPasswordResourceProxyResponse>
): WorkerHandler<RegisterPasswordResourceProxyMessage> {
    const handler = {
        register: newRegisterPasswordHandler((response) => {
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
