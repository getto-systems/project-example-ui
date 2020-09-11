// TODO あとで削除

const worker2: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

worker2.postMessage({ foo: "bar" })

worker2.addEventListener("message", (_event) => {
    console.log("worker2")
    console.log(XMLHttpRequest)
})
