import { newAuthenticatePasswordInfra } from "../../../authenticate/impl/init"

import { AuthenticatePasswordCoreBackgroundInfra } from "../../core/impl"

import { authenticatePasswordEventHasDone } from "../../../authenticate/impl/core"

import { WorkerHandler } from "../../../../../../z_vendor/getto-application/action/worker/background"

import { AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse } from "./message"

import { newAuthenticatePasswordCoreBackgroundMaterial } from "../common"

export function newAuthenticatePasswordHandler(
    post: Post<AuthenticatePasswordProxyResponse>,
): WorkerHandler<AuthenticatePasswordProxyMessage> {
    const material = newAuthenticatePasswordCoreBackgroundMaterial()
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

export function newAuthenticatePasswordCoreBackgroundInfra(): AuthenticatePasswordCoreBackgroundInfra {
    return {
        authenticate: newAuthenticatePasswordInfra(),
    }
}

interface Post<R> {
    (response: R): void
}
