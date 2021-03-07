import { AuthzRepositoryPod } from "../../../common/authz/infra"
import { initRemoteSimulator } from "../../../z_vendor/getto-application/infra/remote/simulate"
import { wrapRepository } from "../../../z_vendor/getto-application/infra/repository/helper"
import { initMemoryDB } from "../../../z_vendor/getto-application/infra/repository/memory"
import { NotifyUnexpectedErrorRemotePod } from "../infra"
import { initNotifyUnexpectedErrorCoreAction } from "./Core/impl"
import { initNotifyUnexpectedErrorResource } from "./impl"

describe("NotifyUnexpectedError", () => {
    test("notify", (done) => {
        const { resource } = standard_elements()

        resource.error.notify("error")

        done()
    })
})

function standard_elements() {
    const resource = newResource(standard_authz())

    return { resource }
}

function newResource(authz: AuthzRepositoryPod) {
    return initNotifyUnexpectedErrorResource(
        initNotifyUnexpectedErrorCoreAction({
            authz,
            notify: standard_notify(),
        }),
    )
}

function standard_authz(): AuthzRepositoryPod {
    const authz = initMemoryDB()
    authz.set({
        nonce: "authz-nonce",
        roles: ["admin"],
    })
    return wrapRepository(authz)
}

function standard_notify(): NotifyUnexpectedErrorRemotePod {
    return initRemoteSimulator(() => ({ success: true, value: true }), { wait_millisecond: 0 })
}
