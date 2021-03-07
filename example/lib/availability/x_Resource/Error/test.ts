import { AuthzRepositoryPod } from "../../../common/authz/infra"
import { initRemoteSimulator } from "../../../z_vendor/getto-application/infra/remote/simulate"
import { wrapRepository } from "../../../z_vendor/getto-application/infra/repository/helper"
import { initMemoryDB } from "../../../z_vendor/getto-application/infra/repository/memory"
import { initNotifyUnexpectedErrorAction } from "../../unexpectedError/Action/impl"

import { initErrorResource } from "./impl"

describe("Error", () => {
    test("notify", (done) => {
        const { resource } = standardResource()

        resource.notify.send("error")

        done()
    })
})

function standardResource() {
    const resource = newTestNotifyErrorResource(standard_authz())

    return { resource }
}

function newTestNotifyErrorResource(authz: AuthzRepositoryPod) {
    return initErrorResource({
        error: initNotifyUnexpectedErrorAction({
            authz,
            notify: initRemoteSimulator(() => ({ success: true, value: true }), {
                wait_millisecond: 0,
            }),
        }),
    })
}

function standard_authz(): AuthzRepositoryPod {
    const authz = initMemoryDB()
    authz.set({
        nonce: "authz-nonce",
        roles: ["admin"],
    })
    return wrapRepository(authz)
}
