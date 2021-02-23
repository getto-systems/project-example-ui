import { initMemoryApiCredentialRepository } from "../../../../../../../common/apiCredential/infra/repository/memory"
import { initMemoryAuthnInfoRepository } from "../../../kernel/infra/repository/authnInfo/memory"
import { initLogoutAction } from "./impl"

import { LogoutState } from "./action"

import { markApiNonce, markApiRoles } from "../../../../../../../common/apiCredential/data"
import { markAuthAt, markAuthnNonce } from "../../../kernel/data"
import { initSyncActionTestRunner } from "../../../../../../../z_getto/application/testHelper"

const STORED_AUTHN_NONCE = "stored-authn-nonce" as const
const STORED_AUTH_AT = new Date("2020-01-01 09:00:00")

describe("Logout", () => {
    test("clear", (done) => {
        const { resource } = standardResource()

        const ignition = resource.clear.ignition()        
        ignition.subscribe(stateHandler())

        resource.clear.submit()

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

        const ignition = resource.clear.ignition()

        const runner = initSyncActionTestRunner()

        runner.addTestCase(
            () => {
                resource.clear.terminate()
                resource.clear.submit()
            },
            (stack) => {
                // no input/validate event after terminate
                expect(stack).toEqual([])
            },
        )

        const handler = runner.run(done)
        ignition.subscribe(handler)
    })
})

function standardResource() {
    const repository = standardRepository()

    const resource = {
        clear: initLogoutAction(repository),
    }

    return { repository, resource }
}

function standardRepository() {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["role"]),
            },
        }),
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
