import { newAuthenticatePasswordInfra } from "../../../../init"

import { AuthenticatePasswordCoreBackgroundBase } from "../../Core/impl"

import { authenticatePasswordEventHasDone } from "../../../../impl"

import { WorkerHandler } from "../../../../../../../../z_getto/application/worker/background"

import { AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse } from "./message"

import { newBackgroundMaterial } from "../common"

export function newAuthenticatePasswordWorkerHandler(
    post: Post<AuthenticatePasswordProxyResponse>,
): WorkerHandler<AuthenticatePasswordProxyMessage> {
    const material = newBackgroundMaterial()
    return (message) => {
        switch (message.method) {
            case "authenticate":
                material.core.authenticate(message.params.fields, (event) => {
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

export function newBackgroundBase(): AuthenticatePasswordCoreBackgroundBase {
    return {
        authenticate: newAuthenticatePasswordInfra(),
    }
}

interface Post<R> {
    (response: R): void
}
