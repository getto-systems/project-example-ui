import { newCoreMaterial } from "../common"

import { requestTokenEventHasDone } from "../../../../impl"

import { WorkerHandler } from "../../../../../../../../../z_getto/application/worker/background"

import {
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse,
} from "./message"

export function newRequestPasswordResetTokenWorkerHandler(
    post: Post<RequestPasswordResetTokenProxyResponse>,
): WorkerHandler<RequestPasswordResetTokenProxyMessage> {
    const material = newCoreMaterial()
    return (message) => {
        switch (message.method) {
            case "requestToken":
                material.requestToken(message.params.fields, (event) => {
                    post({
                        ...message,
                        done: requestTokenEventHasDone(event),
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
