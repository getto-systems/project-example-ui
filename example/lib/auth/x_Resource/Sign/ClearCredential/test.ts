import { LogoutComponentState } from "./Logout/component"

import { initClearCredentialResource } from "./impl"
import { markAuthAt, markTicketNonce } from "../../../sign/authCredential/common/data"
import { initMemoryApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../../common/apiCredential/data"
import { initMemoryAuthCredentialRepository } from "../../../sign/authCredential/common/infra/repository/memory"
import { initClearActionPod } from "../../../sign/authCredential/clear/impl"

const STORED_TICKET_NONCE = "stored-ticket-nonce" as const
const STORED_LOGIN_AT = new Date("2020-01-01 09:00:00")

describe("ClearCredential", () => {
    test("logout", (done) => {
        const { resource } = standardResource()

        resource.logout.addStateHandler(stateHandler())

        resource.logout.submit()

        function stateHandler(): Post<LogoutComponentState> {
            const stack: LogoutComponentState[] = []
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

    const resource = initClearCredentialResource({
        initClear: initClearActionPod(repository),
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
