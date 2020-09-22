import { newPasswordLoginComponent, newWorkerHelper } from "../../main/auth/password_login"

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

const component = newPasswordLoginComponent()
const helper = newWorkerHelper()

component.onStateChange((state) => {
    ctx.postMessage(helper.mapPasswordLoginState(state))
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
