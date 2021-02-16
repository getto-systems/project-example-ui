import { WorkerHandler } from "../../../../../../../common/vendor/getto-worker/main/background"
import { submitPasswordResetRegisterEventHasDone } from "../../impl"
import { newPasswordResetRegisterActionPod } from "../core"
import {
    PasswordResetRegisterActionProxyMessage,
    PasswordResetRegisterActionProxyResponse,
} from "./message"

export function newPasswordResetRegisterActionBackgroundHandler(
    post: Post<PasswordResetRegisterActionProxyResponse>
): WorkerHandler<PasswordResetRegisterActionProxyMessage> {
    const pod = newPasswordResetRegisterActionPod()
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
