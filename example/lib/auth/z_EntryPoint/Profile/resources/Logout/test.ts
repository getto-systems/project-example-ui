import { ClearAuthCredentialComponentState } from "../../../../sign/x_Component/AuthCredential/Clear/component"

import { initAuthProfileLogoutResource } from "./impl"
import { markAuthAt, markTicketNonce } from "../../../../sign/authCredential/common/data"
import { initMemoryApiCredentialRepository } from "../../../../../common/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../../../common/apiCredential/data"
import { initMemoryAuthCredentialRepository } from "../../../../sign/authCredential/common/infra/repository/authCredential/memory"
import { initClearAuthCredentialAction } from "../../../../sign/authCredential/clear/impl"

const STORED_TICKET_NONCE = "stored-ticket-nonce" as const
const STORED_LOGIN_AT = new Date("2020-01-01 09:00:00")

describe("AuthProfileLogout", () => {
    test("clear", (done) => {
        const { resource } = standardResource()

        resource.clear.addStateHandler(stateHandler())

        resource.clear.submit()

        function stateHandler(): Post<ClearAuthCredentialComponentState> {
            const stack: ClearAuthCredentialComponentState[] = []
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
})

function standardResource() {
    const repository = standardRepository()

    const resource = initAuthProfileLogoutResource({
        clear: initClearAuthCredentialAction(repository),
    })

    return { repository, resource }
}

function standardRepository() {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: { apiNonce: markApiNonce("api-nonce"), apiRoles: markApiRoles(["role"]) },
        }),
        authCredentials: initMemoryAuthCredentialRepository({
            ticketNonce: { set: true, value: markTicketNonce(STORED_TICKET_NONCE) },
            lastAuthAt: { set: true, value: markAuthAt(STORED_LOGIN_AT) },
        }),
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
