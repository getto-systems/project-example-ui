import { newStartPasswordResetSessionMaterial } from "../core"

import {
    checkPasswordResetSessionStatusEventHasDone,
    startPasswordResetSessionEventHasDone,
} from "../../../../../../../password/resetSession/start/impl"

import { WorkerHandler } from "../../../../../../../../../common/vendor/getto-worker/main/background"

import {
    StartPasswordResetSessionProxyMessage,
    StartPasswordResetSessionProxyResponse,
} from "./message"

export function newStartPasswordResetSessionHandler(
    post: Post<StartPasswordResetSessionProxyResponse>
): WorkerHandler<StartPasswordResetSessionProxyMessage> {
    const material = newStartPasswordResetSessionMaterial()
    return (message) => {
        switch (message.method) {
            case "start":
                material.start(message.params.fields, (event) => {
                    post({
                        ...message,
                        done: startPasswordResetSessionEventHasDone(event),
                        event,
                    })
                })
                return

            case "checkStatus":
                material.checkStatus(message.params.sessionID, (event) => {
                    post({
                        ...message,
                        done: checkPasswordResetSessionStatusEventHasDone(event),
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
