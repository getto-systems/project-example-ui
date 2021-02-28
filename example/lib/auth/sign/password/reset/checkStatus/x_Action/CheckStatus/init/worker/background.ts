import {
    checkSessionStatusEventHasDone,
    buildCheckSendingStatusLocationInfo,
} from "../../../../impl"

import { WorkerHandler } from "../../../../../../../../../z_vendor/getto-application/action/worker/background"

import {
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse,
} from "./message"
import { newCheckSendingStatusMaterialPod } from "../common"

export function newCheckPasswordResetSendingStatusWorkerHandler(
    post: Post<CheckPasswordResetSendingStatusProxyResponse>,
): WorkerHandler<CheckPasswordResetSendingStatusProxyMessage> {
    const pod = newCheckSendingStatusMaterialPod()
    return (message) => {
        switch (message.method) {
            case "checkStatus":
                pod.initCheckStatus(
                    buildCheckSendingStatusLocationInfo({
                        sessionID: () => message.params.sessionID,
                    }),
                )((event) => {
                    post({
                        ...message,
                        done: checkSessionStatusEventHasDone(event),
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
