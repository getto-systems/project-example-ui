import { initMemoryAuthnInfoRepository } from "../../../kernel/infra/repository/authnInfo/memory"

import { LogoutState } from "./action"

import { markAuthAt, markAuthnNonce } from "../../../kernel/data"
import { initSyncActionTestRunner } from "../../../../../../../z_vendor/getto-application/action/testHelper"
import { initCoreAction, initCoreMaterial } from "./Core/impl"
import { toLogoutResource } from "./impl"
import { initMemoryRepository } from "../../../../../../../z_vendor/getto-application/infra/repository/memory"
import { AuthzRepositoryResponse } from "../../../../../../../common/authz/infra"

const STORED_AUTHN_NONCE = "stored-authn-nonce" as const
const STORED_AUTH_AT = new Date("2020-01-01 09:00:00")

describe("Logout", () => {
    test("clear", (done) => {
        const { resource } = standardResource()

        resource.logout.subscriber.subscribe(stateHandler())

        resource.logout.submit()

        function stateHandler(): Post<LogoutState> {
            const stack: LogoutState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-logout":
                        // work in progress...
                        break

                    case "succeed-to-logout":
                        expect(stack).toEqual([{ type: "succeed-to-logout" }])
                        done()
                        break

                    case "failed-to-logout":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("terminate", (done) => {
        const { resource } = standardResource()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    resource.logout.terminate()
                    resource.logout.submit()
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
    const repository = standardRepository()

    const resource = toLogoutResource(initCoreAction(initCoreMaterial(repository)))

    return { repository, resource }
}

function standardRepository() {
    const authz = initMemoryRepository<AuthzRepositoryResponse>()
    authz.set({ nonce: "nonce", roles: ["role"] })    

    return {
        authz,
        authnInfos: initMemoryAuthnInfoRepository({
            authnNonce: { set: true, value: markAuthnNonce(STORED_AUTHN_NONCE) },
            lastAuthAt: { set: true, value: markAuthAt(STORED_AUTH_AT) },
        }),
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
