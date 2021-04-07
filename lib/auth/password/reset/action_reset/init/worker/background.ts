import { newResetPasswordInfra } from "../../../reset/impl/init"

import { newCoreBackgroundPod } from "../common"

import { resetPasswordEventHasDone } from "../../../reset/impl/core"

import { WorkerHandler } from "../../../../../../z_vendor/getto-application/action/worker/background"

import { ResetPasswordCoreBackgroundInfra } from "../../core/impl"

import { ResetPasswordProxyMessage, ResetPasswordProxyResponse } from "./message"
import { backgroundLocationDetecter } from "../../../../../../z_vendor/getto-application/location/helper"
import { RemoteOutsideFeature } from "../../../../../../z_vendor/getto-application/infra/remote/infra"

type OutsideFeature = RemoteOutsideFeature
export function newResetPasswordHandler(
    feature: OutsideFeature,
    post: Post<ResetPasswordProxyResponse>,
): WorkerHandler<ResetPasswordProxyMessage> {
    const pod = newCoreBackgroundPod(feature)
    return (message) => {
        switch (message.method) {
            case "reset":
                pod.initReset(backgroundLocationDetecter(message.params.resetToken))(
                    message.params.fields,
                    (event) => {
                        post({
                            ...message,
                            done: resetPasswordEventHasDone(event),
                            event,
                        })
                    },
                )
                return
        }
    }
}

export function newResetPasswordCoreBackgroundInfra(
    feature: OutsideFeature,
): ResetPasswordCoreBackgroundInfra {
    return {
        reset: newResetPasswordInfra(feature),
    }
}

interface Post<R> {
    (response: R): void
}
