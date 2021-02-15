import { WorkerBackgroundHandler } from "../../../../../../../vendor/getto-worker/main/background"
import { submitPasswordResetRegisterEventHasDone } from "../../impl"
import { newPasswordResetRegisterRegisterActionPod } from "../core"
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
