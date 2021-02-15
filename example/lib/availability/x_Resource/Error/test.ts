import { initNotifyUnexpectedErrorSimulateRemoteAccess } from "../../unexpectedError/infra/remote/notifyUnexpectedError/simulate"

import { initUnexpectedErrorAction } from "../../unexpectedError/impl"

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
        error: initUnexpectedErrorAction({
            notify: initNotifyUnexpectedErrorSimulateRemoteAccess(),
        }),
    })
}
