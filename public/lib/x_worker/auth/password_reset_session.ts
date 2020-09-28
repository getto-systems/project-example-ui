import { newPasswordResetSessionComponent, newWorkerHelper } from "../../main/auth/password_reset_session"

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

const component = newPasswordResetSessionComponent()
const helper = newWorkerHelper()

component.onStateChange((state) => {
    ctx.postMessage(helper.mapPasswordResetSessionState(state))
})
component.onLoginIDFieldStateChange((state) => {
    ctx.postMessage(helper.mapLoginIDFieldState(state))
})

const resource = component.init()

ctx.addEventListener("message", (event) => {
    try {
        resource.send(event.data)
    } catch (err) {
        ctx.postMessage({ type: "error", err: `${err}` })
    }
})
