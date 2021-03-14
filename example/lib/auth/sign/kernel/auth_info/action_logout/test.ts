import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../../../../z_vendor/getto-application/action/test_helper"

import { mockDB } from "../../../../../z_vendor/getto-application/infra/repository/mock"

import { wrapRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"
import { initLogoutCoreAction, initLogoutCoreMaterial } from "./core/impl"
import { initLogoutResource } from "./impl"

import { AuthzRepositoryPod, AuthzRepositoryValue } from "../kernel/infra"
import { AuthnRepositoryPod } from "../kernel/infra"

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
    const resource = initResource(standard_authn(), standard_authz())

    return { resource }
}

function initResource(authn: AuthnRepositoryPod, authz: AuthzRepositoryPod): LogoutResource {
    return initLogoutResource(
        initLogoutCoreAction(
            initLogoutCoreMaterial({
                authn,
                authz,
            }),
        ),
    )
}

function standard_authn(): AuthnRepositoryPod {
    const db = mockDB()
    db.set({
        nonce: "stored-authn-nonce",
        authAt: new Date("2020-01-01 09:00:00").toISOString(),
    })
    return wrapRepository(db)
}
function standard_authz(): AuthzRepositoryPod {
    const db = mockDB<AuthzRepositoryValue>()
    db.set({
        nonce: "nonce",
        roles: ["role"],
    })
    return wrapRepository(db)
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
