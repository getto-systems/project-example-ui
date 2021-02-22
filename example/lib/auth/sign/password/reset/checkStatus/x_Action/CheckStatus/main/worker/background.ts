import { newCheckPasswordResetSendingStatusMaterialPod } from "../core"

import { checkPasswordResetSessionStatusEventHasDone } from "../../../../impl"

import { WorkerHandler } from "../../../../../../../../../z_getto/application/worker/background"

import {
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse,
} from "./message"

export function newCheckPasswordResetSendingStatusHandler(
    post: Post<CheckPasswordResetSendingStatusProxyResponse>,
): WorkerHandler<CheckPasswordResetSendingStatusProxyMessage> {
    const pod = newCheckPasswordResetSendingStatusMaterialPod()
    return (message) => {
        switch (message.method) {
            case "checkStatus":
                pod.initCheckStatus({ getPasswordResetSessionID: () => message.params.sessionID })(
                    (event) => {
                        post({
                            ...message,
                            done: checkPasswordResetSessionStatusEventHasDone(event),
                            event,
                        })
                    },
                )
                return
        }
    }
}

interface Post<R> {
    (response: R): void
}
