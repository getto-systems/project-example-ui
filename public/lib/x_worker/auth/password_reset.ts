import { newPasswordResetComponent, newWorkerHelper } from "../../z_main/auth/password_reset"

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

const component = newPasswordResetComponent()
const helper = newWorkerHelper()

component.init((state) => {
    ctx.postMessage(helper.mapPasswordResetComponentState(state))
})
component.initLoginIDField((state) => {
    ctx.postMessage(helper.mapLoginIDFieldComponentState(state))
})
component.initPasswordField((state) => {
    ctx.postMessage(helper.mapPasswordFieldComponentState(state))
})

ctx.addEventListener("message", (event) => {
    component.trigger(event.data)
})
