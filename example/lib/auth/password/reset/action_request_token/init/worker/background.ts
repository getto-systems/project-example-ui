import { newRequestResetTokenCoreMaterial } from "../common"

import { requestResetTokenEventHasDone } from "../../../request_token/impl/core"

import { WorkerHandler } from "../../../../../../z_vendor/getto-application/action/worker/background"

import {
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse,
} from "./message"

type OutsideFeature = Readonly<{
    webCrypto: Crypto
}>
export function newRequestResetTokenHandler(
    feature: OutsideFeature,
    post: Post<RequestPasswordResetTokenProxyResponse>,
): WorkerHandler<RequestPasswordResetTokenProxyMessage> {
    const { webCrypto } = feature
    const material = newRequestResetTokenCoreMaterial(webCrypto)
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
