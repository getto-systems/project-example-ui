import { newRequestResetTokenCoreMaterial } from "../common"

import { requestResetTokenEventHasDone } from "../../../request_token/impl/core"

import { WorkerHandler } from "../../../../../../z_vendor/getto-application/action/worker/background"

import {
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse,
} from "./message"

import { RemoteOutsideFeature } from "../../../../../../z_vendor/getto-application/infra/remote/infra"

type OutsideFeature = RemoteOutsideFeature
export function newRequestResetTokenHandler(
    feature: OutsideFeature,
    post: Post<RequestPasswordResetTokenProxyResponse>,
): WorkerHandler<RequestPasswordResetTokenProxyMessage> {
    const material = newRequestResetTokenCoreMaterial(feature)
    return (message) => {
        switch (message.method) {
            case "requestToken":
                material.requestToken(message.params.fields, (event) => {
                    post({
                        ...message,
                        done: requestResetTokenEventHasDone(event),
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
