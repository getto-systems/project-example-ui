import { newLoadApplicationComponent } from "../../z_main/auth/load_application"

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

const component = newLoadApplicationComponent(location)

component.init((state) => {
    ctx.postMessage(state)
})

ctx.addEventListener("message", (event) => {
    component.trigger(event.data)
})
