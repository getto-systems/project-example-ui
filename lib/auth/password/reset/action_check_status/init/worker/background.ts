import { WorkerHandler } from "../../../../../../z_vendor/getto-application/action/worker/background"

import {
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse,
} from "./message"
import { newCheckSendingStatusMaterialPod } from "../common"
import { backgroundLocationDetecter } from "../../../../../../z_vendor/getto-application/location/helper"
import { RemoteOutsideFeature } from "../../../../../../z_vendor/getto-application/infra/remote/infra"

type OutsideFeature = RemoteOutsideFeature
export function newCheckPasswordResetSendingStatusWorkerHandler(
    feature: OutsideFeature,
    post: Post<CheckPasswordResetSendingStatusProxyResponse>,
): WorkerHandler<CheckPasswordResetSendingStatusProxyMessage> {
    const pod = newCheckSendingStatusMaterialPod(feature)
    return async (message) => {
        switch (message.method) {
            case "checkStatus":
                await pod.initCheckStatus(backgroundLocationDetecter(message.params))((event) => {
                    post({
                        ...message,
                        done: false,
                        event,
                    })
                })
                post({ ...message, done: true })
                return
        }
    }
}

interface Post<R> {
    (response: R): void
}
