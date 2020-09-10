/* eslint-disable @typescript-eslint/no-explicit-any */
const ctx: Worker = self as any

ctx.postMessage({ foo: "bar" })

ctx.addEventListener("message", (event) => {
    console.log(event.data)
})
