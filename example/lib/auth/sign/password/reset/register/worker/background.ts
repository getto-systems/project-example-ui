import { WorkerBackgroundHandler } from "../../../../../../common/getto-worker/worker/background"
import { submitEventHasDone } from "../impl"
import { newRegisterActionPod } from "../main"
import { RegisterActionProxyMessage, RegisterActionProxyResponse } from "./message"

export function newRegisterActionBackgroundHandler(
    post: Post<RegisterActionProxyResponse>
): WorkerBackgroundHandler<RegisterActionProxyMessage> {
    const pod = newRegisterActionPod()
    return (message) => {
        switch (message.method) {
            case "submit":
                pod.initSubmit({
                    getResetToken: () => message.params.resetToken,
                })(message.params.fields, (event) => {
                    post({ ...message, done: submitEventHasDone(event), event })
                })
                return
        }
    }
}

interface Post<R> {
    (response: R): void
}
