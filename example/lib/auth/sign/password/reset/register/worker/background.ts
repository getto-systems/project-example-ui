import { WorkerBackgroundHandler } from "../../../../../../vendor/getto-worker/worker/background"
import { submitPasswordResetRegisterEventHasDone } from "../impl"
import { newPasswordResetRegisterRegisterActionPod } from "../main"
import { RegisterActionProxyMessage, RegisterActionProxyResponse } from "./message"

export function newRegisterActionBackgroundHandler(
    post: Post<RegisterActionProxyResponse>
): WorkerBackgroundHandler<RegisterActionProxyMessage> {
    const pod = newPasswordResetRegisterRegisterActionPod()
    return (message) => {
        switch (message.method) {
            case "submit":
                pod.initSubmit({
                    getPasswordResetToken: () => message.params.resetToken,
                })(message.params.fields, (event) => {
                    post({ ...message, done: submitPasswordResetRegisterEventHasDone(event), event })
                })
                return
        }
    }
}

interface Post<R> {
    (response: R): void
}
