import { newAuthenticatePasswordInfra } from "../../../authenticate/impl/init"

import { AuthenticatePasswordCoreBackgroundInfra } from "../../core/impl"

import { authenticatePasswordEventHasDone } from "../../../authenticate/impl/core"

import { WorkerHandler } from "../../../../../z_vendor/getto-application/action/worker/background"

import { AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse } from "./message"

import { RemoteOutsideFeature } from "../../../../../z_vendor/getto-application/infra/remote/infra"

import { newAuthenticatePasswordCoreBackgroundMaterial } from "../common"

type OutsideFeature = RemoteOutsideFeature
export function newAuthenticatePasswordHandler(
    feature: OutsideFeature,
    post: Post<AuthenticatePasswordProxyResponse>,
): WorkerHandler<AuthenticatePasswordProxyMessage> {
    const material = newAuthenticatePasswordCoreBackgroundMaterial(feature)
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
    feature: OutsideFeature,
): AuthenticatePasswordCoreBackgroundInfra {
    return {
        authenticate: newAuthenticatePasswordInfra(feature),
    }
}

interface Post<R> {
    (response: R): void
}
