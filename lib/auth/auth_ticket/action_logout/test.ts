import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../../z_vendor/getto-application/action/test_helper_legacy"

import { mockRepository } from "../../../z_vendor/getto-application/infra/repository/mock"

import { convertRepository } from "../../../z_vendor/getto-application/infra/repository/helper"
import { initLogoutCoreAction, initLogoutCoreMaterial } from "./core/impl"
import { initLogoutResource } from "./impl"

import { AuthnRepositoryValue, AuthzRepositoryPod, AuthzRepositoryValue } from "../kernel/infra"
import { AuthnRepositoryPod } from "../kernel/infra"

import { LogoutResource } from "./resource"
import { LogoutCoreState } from "./core/action"
import { ClearAuthTicketRemotePod } from "../clear/infra"
import { mockRemotePod } from "../../../z_vendor/getto-application/infra/remote/mock"
import { clearAuthTicketEventHasDone } from "../clear/impl/core"

describe("Logout", () => {
    test("clear", () =>
        new Promise<void>((done) => {
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
        }))

    test("terminate", () =>
        new Promise<void>((done) => {
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
        }))
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
                clear: standard_clear(),
            }),
        ),
    )
}

function standard_authn(): AuthnRepositoryPod {
    const db = mockRepository<AuthnRepositoryValue>()
    db.set({
        authAt: new Date("2020-01-01 09:00:00").toISOString(),
    })
    return convertRepository(db)
}
function standard_authz(): AuthzRepositoryPod {
    const db = mockRepository<AuthzRepositoryValue>()
    db.set({
        roles: ["role"],
    })
    return convertRepository(db)
}

function standard_clear(): ClearAuthTicketRemotePod {
    return mockRemotePod(() => ({ success: true, value: true }), { wait_millisecond: 0 })
}

function actionHasDone(state: LogoutCoreState): boolean {
    switch (state.type) {
        case "initial-logout":
            return false

        default:
            return clearAuthTicketEventHasDone(state)
    }
}
