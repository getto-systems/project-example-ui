import { LogoutComponentState } from "./Logout/component"

import { markApiCredential, markAuthAt, markTicketNonce } from "../../../common/credential/data"
import { initAuthCredentialRepository } from "../../../sign/credentialStore/impl/repository/authCredential"
import { initTestAuthCredentialStorage } from "../../../sign/credentialStore/tests/storage"
import { initClearCredentialResource } from "./impl"
import { initTestLogoutAction } from "../../../sign/credentialStore/tests/logout"
import { AuthCredentialRepository } from "../../../sign/credentialStore/infra"

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
    const resource = newTestClearCredentialResource(repository.authCredentials)

    return { repository, resource }
}

function newTestClearCredentialResource(authCredentials: AuthCredentialRepository) {
    return initClearCredentialResource({
        logout: initTestLogoutAction(authCredentials),
    })
}

function standardRepository() {
    return {
        authCredentials: initAuthCredentialRepository(
            initTestAuthCredentialStorage({
                ticketNonce: { set: true, value: markTicketNonce(STORED_TICKET_NONCE) },
                apiCredential: { set: true, value: markApiCredential({ apiRoles: ["role"] }) },
                lastAuthAt: { set: true, value: markAuthAt(STORED_LOGIN_AT) },
            })
        ),
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
