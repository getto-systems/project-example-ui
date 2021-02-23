import { newAuthenticateInfra } from "../../../../init"

import { CoreBackgroundInfra } from "../../Core/impl"

import { authenticateEventHasDone } from "../../../../impl"

import { WorkerHandler } from "../../../../../../../../z_getto/application/worker/background"

import { AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse } from "./message"

import { newCoreBackgroundMaterial } from "../common"

export function newAuthenticatePasswordWorkerHandler(
    post: Post<AuthenticatePasswordProxyResponse>,
): WorkerHandler<AuthenticatePasswordProxyMessage> {
    const material = newCoreBackgroundMaterial()
    return (message) => {
        switch (message.method) {
            case "authenticate":
                material.authenticate(message.params.fields, (event) => {
                    post({
                        ...message,
                        done: authenticateEventHasDone(event),
                        event,
                    })
                })
                return
        }
    }
}

export function newCoreBackgroundInfra(): CoreBackgroundInfra {
    return {
        authenticate: newAuthenticateInfra(),
    }
}

interface Post<R> {
    (response: R): void
}
