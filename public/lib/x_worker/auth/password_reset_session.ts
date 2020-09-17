import { newPasswordResetSessionComponent, newWorkerHelper } from "../../main/auth/password_reset_session"

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

const component = newPasswordResetSessionComponent()
const helper = newWorkerHelper()

component.init((state) => {
    ctx.postMessage(helper.mapPasswordResetSessionComponentState(state))
})
component.initLoginIDField((state) => {
    ctx.postMessage(helper.mapLoginIDFieldComponentState(state))
})

ctx.addEventListener("message", (event) => {
    component.trigger(event.data)
})
