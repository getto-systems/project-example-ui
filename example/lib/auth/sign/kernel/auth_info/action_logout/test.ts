import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../../../../z_vendor/getto-application/action/test_helper"

import { mockDB } from "../../../../../z_vendor/getto-application/infra/repository/mock"

import { wrapRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"
import { initLogoutCoreAction, initLogoutCoreMaterial } from "./core/impl"
import { initLogoutResource } from "./impl"

import { AuthzRepositoryPod, AuthzRepositoryValue } from "../../../../common/authz/infra"
import { LastAuthRepositoryPod } from "../kernel/infra"

import { LogoutResource } from "./resource"
import { LogoutCoreState } from "./core/action"

describe("Logout", () => {
    test("clear", (done) => {
        const { resource } = standard()

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.logout.submit()
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ type: "succeed-to-logout" }])
                },
            },
        ])

        resource.logout.subscriber.subscribe(runner(done))
    })

    test("terminate", (done) => {
        const { resource } = standard()

        const runner = setupSyncActionTestRunner([
            {
                statement: (check) => {
                    resource.logout.terminate()
                    resource.logout.submit()

                    setTimeout(check, 256) // wait for events...
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        resource.logout.subscriber.subscribe(runner(done))
    })
})

function standard() {
    const resource = initResource(standard_lastAuth(), standard_authz())

    return { resource }
}

function initResource(lastAuth: LastAuthRepositoryPod, authz: AuthzRepositoryPod): LogoutResource {
    return initLogoutResource(
        initLogoutCoreAction(
            initLogoutCoreMaterial({
                lastAuth,
                authz,
            }),
        ),
    )
}

function standard_lastAuth(): LastAuthRepositoryPod {
    const lastAuth = mockDB()
    lastAuth.set({
        nonce: "stored-authn-nonce",
        lastAuthAt: new Date("2020-01-01 09:00:00").toISOString(),
    })
    return wrapRepository(lastAuth)
}
function standard_authz(): AuthzRepositoryPod {
    const authz = mockDB<AuthzRepositoryValue>()
    authz.set({
        nonce: "nonce",
        roles: ["role"],
    })
    return wrapRepository(authz)
}

function actionHasDone(state: LogoutCoreState): boolean {
    switch (state.type) {
        case "initial-logout":
            return false

        case "succeed-to-logout":
        case "failed-to-logout":
            return true
    }
}
