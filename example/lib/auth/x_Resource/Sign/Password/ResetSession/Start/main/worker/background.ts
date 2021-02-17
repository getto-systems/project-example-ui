import { newStartPasswordResetSessionHandler } from "../../../../../../../sign/x_Action/Password/ResetSession/Start/Core/main/worker/background"

import { WorkerHandler } from "../../../../../../../../z_vendor/getto-worker/background"

import {
    StartPasswordResetSessionResourceProxyMessage,
    StartPasswordResetSessionResourceProxyResponse,
} from "./message"

export function newStartPasswordResetSessionResourceHandler(
    post: Post<StartPasswordResetSessionResourceProxyResponse>
): WorkerHandler<StartPasswordResetSessionResourceProxyMessage> {
    const handler = {
        start: newStartPasswordResetSessionHandler((response) => {
            post({ type: "start", response })
        }),
    }
    return (message) => {
        switch (message.type) {
            case "start":
                handler.start(message.message)
                return
        }
    }
}

interface Post<R> {
    (response: R): void
}
