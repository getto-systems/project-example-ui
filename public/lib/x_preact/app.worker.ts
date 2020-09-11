// TODO あとで削除

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

ctx.postMessage({ foo: "bar" })

ctx.addEventListener("message", (event) => {
    console.log(event.data)

    console.log(location);
})
