import {
    initAsyncActionTestRunner,
    initSyncActionTestRunner,
} from "../../../../../../z_vendor/getto-application/action/testHelper"

import { initMemoryDB } from "../../../../../../z_vendor/getto-application/infra/repository/memory"

import { wrapRepository } from "../../../../../../z_vendor/getto-application/infra/repository/helper"
import { initLogoutCoreAction, initLogoutCoreMaterial } from "./Core/impl"
import { toLogoutResource } from "./impl"

import { AuthzRepositoryPod, AuthzRepositoryValue } from "../../../../../../common/authz/infra"
import { LastAuthRepositoryPod } from "../../kernel/infra"

import { LogoutResource } from "./action"
import { LogoutCoreState } from "./Core/action"

describe("Logout", () => {
    test("clear", (done) => {
        const { resource } = standardResource()

        const runner = initAsyncActionTestRunner(actionHasDone, [
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
        const { resource } = standardResource()

        const runner = initSyncActionTestRunner([
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

function standardResource() {
    const resource = newResource(standard_lastAuth(), standard_authz())

    return { resource }
}

function newResource(lastAuth: LastAuthRepositoryPod, authz: AuthzRepositoryPod): LogoutResource {
    return toLogoutResource(
        initLogoutCoreAction(
            initLogoutCoreMaterial({
                lastAuth,
                authz,
            }),
        ),
    )
}

function standard_lastAuth(): LastAuthRepositoryPod {
    const lastAuth = initMemoryDB()
    lastAuth.set({
        nonce: "stored-authn-nonce",
        lastAuthAt: new Date("2020-01-01 09:00:00").toISOString(),
    })
    return wrapRepository(lastAuth)
}
function standard_authz(): AuthzRepositoryPod {
    const authz = initMemoryDB<AuthzRepositoryValue>()
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
