import { initNotifyErrorResource } from "./impl"

import { initTestNotifyAction } from "../../error/notify/tests/notify"

describe("NotifyError", () => {
    test("notify", (done) => {
        const { resource } = standardResource()

        resource.notify.send("error")

        done()
    })
})

function standardResource() {
    const resource = newTestNotifyErrorResource()

    return { resource }
}

function newTestNotifyErrorResource() {
    return initNotifyErrorResource({
        notify: initTestNotifyAction(),
    })
}
