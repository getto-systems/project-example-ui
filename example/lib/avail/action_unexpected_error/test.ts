import { AuthzRepositoryPod } from "../../common/authz/infra"
import { mockRemotePod } from "../../z_vendor/getto-application/infra/remote/mock"
import { wrapRepository } from "../../z_vendor/getto-application/infra/repository/helper"
import { mockDB } from "../../z_vendor/getto-application/infra/repository/mock"
import { NotifyUnexpectedErrorRemotePod } from "../unexpected_error/infra"
import { initNotifyUnexpectedErrorCoreAction } from "./core/impl"
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
    const authz = mockDB()
    authz.set({
        nonce: "authz-nonce",
        roles: ["admin"],
    })
    return wrapRepository(authz)
}

function standard_notify(): NotifyUnexpectedErrorRemotePod {
    return mockRemotePod(() => ({ success: true, value: true }), { wait_millisecond: 0 })
}
