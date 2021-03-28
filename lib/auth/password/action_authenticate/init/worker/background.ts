import { newAuthenticatePasswordInfra } from "../../../authenticate/impl/init"

import { AuthenticatePasswordCoreBackgroundInfra } from "../../core/impl"

import { authenticatePasswordEventHasDone } from "../../../authenticate/impl/core"

import { WorkerHandler } from "../../../../../z_vendor/getto-application/action/worker/background"

import { AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse } from "./message"

import { newAuthenticatePasswordCoreBackgroundMaterial } from "../common"

type OutsideFeature = Readonly<{
    webCrypto: Crypto
}>
export function newAuthenticatePasswordHandler(
    feature: OutsideFeature,
    post: Post<AuthenticatePasswordProxyResponse>,
): WorkerHandler<AuthenticatePasswordProxyMessage> {
    const { webCrypto } = feature
    const material = newAuthenticatePasswordCoreBackgroundMaterial(webCrypto)
    return (message) => {
        switch (message.method) {
            case "authenticate":
                material.authenticate(message.params.fields, (event) => {
                    post({
                        ...message,
                        done: authenticatePasswordEventHasDone(event),
                        event,
                    })
                })
                return
        }
    }
}

export function newAuthenticatePasswordCoreBackgroundInfra(
    webCrypto: Crypto,
): AuthenticatePasswordCoreBackgroundInfra {
    return {
        authenticate: newAuthenticatePasswordInfra(webCrypto),
    }
}

interface Post<R> {
    (response: R): void
}
