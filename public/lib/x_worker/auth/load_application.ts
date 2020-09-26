import { newLoadApplicationComponent } from "../../main/auth/load_application"

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

const component = newLoadApplicationComponent()

component.onStateChange((state) => {
    ctx.postMessage(state)
})

ctx.addEventListener("message", (event) => {
    try {
        component.trigger(event.data)
    } catch (err) {
        ctx.postMessage({ type: "error", err: `${err}` })
    }
})

component.init()
