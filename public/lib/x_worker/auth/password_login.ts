import { newWorkerAuthBackground } from "../../main/auth/background"
import { newPasswordLoginComponent, newWorkerHelper } from "../../main/auth/password_login"

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

const auth = newWorkerAuthBackground()
const component = newPasswordLoginComponent(auth.background)

const helper = newWorkerHelper()

auth.subscriber.storeCredential.handleOperation((operation) => {
    ctx.postMessage(helper.mapStoreCredentialOperation(operation))
})
component.onStateChange((state) => {
    ctx.postMessage(helper.mapPasswordLoginState(state))
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
        resource.request(event.data)
    } catch (err) {
        ctx.postMessage({ type: "error", err: `${err}` })
    }
})
