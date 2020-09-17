import { newPasswordLoginComponent, newWorkerHelper } from "../../z_main/auth/password_login"

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

const component = newPasswordLoginComponent()
const helper = newWorkerHelper()

component.init((state) => {
    ctx.postMessage(helper.mapPasswordLoginComponentState(state))
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
