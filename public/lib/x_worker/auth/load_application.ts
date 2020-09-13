import { newComponent } from "../../z_main/auth/load_application"

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

const component = newComponent(location)

component.init((state) => {
    ctx.postMessage(state)
})

ctx.addEventListener('message', async (event) => {
    component.trigger(event.data)
})
