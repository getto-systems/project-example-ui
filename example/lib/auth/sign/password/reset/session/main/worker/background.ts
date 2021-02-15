import { WorkerBackgroundHandler } from "../../../../../../../vendor/getto-worker/worker/background"

import { newPasswordResetSessionActionPod } from "../core"

import {
    PasswordResetSessionActionProxyMessage,
    PasswordResetSessionActionProxyResponse,
} from "./message"

import {
    checkPasswordResetSessionStatusEventHasDone,
    startPasswordResetSessionEventHasDone,
} from "../../impl"

export function newPasswordResetSessionActionBackgroundHandler(
    post: Post<PasswordResetSessionActionProxyResponse>
): WorkerBackgroundHandler<PasswordResetSessionActionProxyMessage> {
    const pod = newPasswordResetSessionActionPod()
    return (message) => {
        switch (message.method) {
            case "start":
                pod.initStart()(message.params.fields, (event) => {
                    post({ ...message, done: startPasswordResetSessionEventHasDone(event), event })
                })
                return

            case "checkStatus":
                pod.initCheckStatus()(message.params.sessionID, (event) => {
                    post({ ...message, done: checkPasswordResetSessionStatusEventHasDone(event), event })
                })
                return

            default:
                assertNever(message)
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}

interface Post<R> {
    (response: R): void
}
