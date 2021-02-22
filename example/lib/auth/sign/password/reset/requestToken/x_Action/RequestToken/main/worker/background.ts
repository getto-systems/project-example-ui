import { newRequestPasswordResetTokenMaterial } from "../core"

import { requestPasswordResetTokenEventHasDone } from "../../../../impl"

import { WorkerHandler } from "../../../../../../../../../z_getto/application/worker/background"

import {
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse,
} from "./message"

export function newRequestPasswordResetTokenHandler(
    post: Post<RequestPasswordResetTokenProxyResponse>,
): WorkerHandler<RequestPasswordResetTokenProxyMessage> {
    const material = newRequestPasswordResetTokenMaterial()
    return (message) => {
        switch (message.method) {
            case "request":
                material.request(message.params.fields, (event) => {
                    post({
                        ...message,
                        done: requestPasswordResetTokenEventHasDone(event),
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
