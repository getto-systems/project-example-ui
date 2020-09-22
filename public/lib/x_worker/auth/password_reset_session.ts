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

ctx.addEventListener("message", (event) => {
    component.trigger(event.data)
})
