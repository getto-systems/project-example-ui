import { newLoginActionPod } from "../main"

import { submitEventHasDone } from "../impl"

import { WorkerBackgroundHandler } from "../../../../../common/getto-worker/worker/background"

import { LoginActionProxyMessage, LoginActionProxyResponse } from "./message"

export function newLoginActionBackgroundHandler(
    post: Post<LoginActionProxyResponse>
): WorkerBackgroundHandler<LoginActionProxyMessage> {
    const pod = newLoginActionPod()
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
