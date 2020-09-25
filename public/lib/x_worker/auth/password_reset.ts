import { newPasswordResetComponent, newWorkerHelper } from "../../main/auth/password_reset"

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

const component = newPasswordResetComponent()
const helper = newWorkerHelper()

component.onStateChange((state) => {
    ctx.postMessage(helper.mapPasswordResetState(state))
})
component.onLoginIDFieldStateChange((state) => {
    ctx.postMessage(helper.mapLoginIDFieldState(state))
})
component.onPasswordFieldStateChange((state) => {
    ctx.postMessage(helper.mapPasswordFieldState(state))
})

ctx.addEventListener("message", (event) => {
    component.trigger(event.data)
})

component.init()
