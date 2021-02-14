import { WorkerBackgroundHandler } from "../../../../../../vendor/getto-worker/worker/background"

import { newSessionActionPod } from "../main"

import { SessionActionProxyMessage, SessionActionProxyResponse } from "./message"

import { checkStatusEventHasDone, startSessionEventHasDone } from "../impl"

export function newSessionActionBackgroundHandler(
    post: Post<SessionActionProxyResponse>
): WorkerBackgroundHandler<SessionActionProxyMessage> {
    const pod = newSessionActionPod()
    return (message) => {
        switch (message.method) {
            case "startSession":
                pod.initStartSession()(message.params.fields, (event) => {
                    post({ ...message, done: startSessionEventHasDone(event), event })
                })
                return

            case "checkStatus":
                pod.initCheckStatus()(message.params.sessionID, (event) => {
                    post({ ...message, done: checkStatusEventHasDone(event), event })
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
