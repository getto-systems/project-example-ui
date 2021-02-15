import { newPasswordLoginActionPod } from "../core"

import { submitEventHasDone } from "../../impl"

import { WorkerBackgroundHandler } from "../../../../../../vendor/getto-worker/worker/background"

import { PasswordLoginActionProxyMessage, PasswordLoginActionProxyResponse } from "./message"

export function newPasswordLoginActionBackgroundHandler(
    post: Post<PasswordLoginActionProxyResponse>
): WorkerBackgroundHandler<PasswordLoginActionProxyMessage> {
    const pod = newPasswordLoginActionPod()
    return (message) => {
        switch (message.method) {
            case "submit":
                pod.initSubmit()(message.params.fields, (event) => {
                    post({ ...message, done: submitEventHasDone(event), event })
                })
                return
        }
    }
}

interface Post<R> {
    (response: R): void
}
