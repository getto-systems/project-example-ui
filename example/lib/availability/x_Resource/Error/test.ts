import { initNotifySimulateRemoteAccess } from "../../error/infra/remote/notify/simulate"

import { initErrorAction } from "../../error/impl"

import { initErrorResource } from "./impl"

describe("Error", () => {
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
    return initErrorResource({
        error: initErrorAction({
            notify: initNotifySimulateRemoteAccess(),
        }),
    })
}
