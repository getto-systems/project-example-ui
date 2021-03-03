import { initRemoteSimulator } from "../../../z_vendor/getto-application/infra/remote/simulate"
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
            notify: initRemoteSimulator(() => ({ success: true, value: true }), {
                wait_millisecond: 0,
            }),
        }),
    })
}
