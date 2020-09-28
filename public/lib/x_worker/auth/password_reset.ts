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

const resource = component.init()

ctx.addEventListener("message", (event) => {
    try {
        resource.send(event.data)
    } catch (err) {
        ctx.postMessage({ type: "error", err: `${err}` })
    }
})
