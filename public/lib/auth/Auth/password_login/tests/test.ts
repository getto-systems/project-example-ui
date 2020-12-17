import { Config, newPasswordLoginResource, Repository, Simulator } from "./core"

import { initMemoryAuthCredentialRepository } from "../../../common/credential/impl/repository/auth_credential/memory"

import { PasswordLoginState } from "../component"

import { markScriptPath } from "../../../common/application/data"
import { markApiCredential, markLoginAt, markTicketNonce } from "../../../common/credential/data"
import { markInputValue } from "../../../common/field/data"

const VALID_LOGIN_ID = "login-id" as const
const VALID_PASSWORD = "password" as const

const AUTHORIZED_TICKET_NONCE = "ticket-nonce" as const
const SUCCEED_TO_LOGIN_AT = new Date("2020-01-01 10:00:00")

describe("PasswordLogin", () => {
    test("submit valid login-id and password", (done) => {
        const currentURL: URL = new URL("https://example.com/index.html")
        const config = standardConfig()
        const repository = standardRepository()
        const simulator = standardSimulator()
        const resource = newPasswordLoginResource(currentURL, config, repository, simulator)

        const stack: PasswordLoginState[] = []
        resource.passwordLogin.onStateChange((state) => {
            stack.push(state)

            switch (state.type) {
                case "initial-login":
                case "try-to-login":
                case "delayed-to-login":
                    // work in progress...
                    break

                case "succeed-to-login":
                    expect(stack).toEqual([
                        { type: "try-to-login" },
                        {
                            type: "succeed-to-login",
                            scriptPath: markScriptPath("//secure.example.com/index.js"),
                        },
                    ])
                    expect(repository.authCredentials.findLastLogin()).toEqual({
                        success: true,
                        found: true,
                        lastLogin: {
                            ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
                            lastLoginAt: markLoginAt(SUCCEED_TO_LOGIN_AT),
                        },
                    })
                    done()
                    break

                case "failed-to-login":
                case "storage-error":
                case "load-error":
                case "error":
                    done(new Error(`${state.type}: ${state.err}`))
                    break
            }
        })

        resource.loginIDField.set(markInputValue(VALID_LOGIN_ID))
        resource.passwordField.set(markInputValue(VALID_PASSWORD))

        resource.passwordLogin.login()
    })
})

function standardConfig(): Config {
    return {
        application: {
            secureScriptPath: {
                secureServerHost: "secure.example.com",
            },
        },
        passwordLogin: {
            login: {
                delay: { delay_millisecond: 10 },
            },
        },
    }
}
function standardRepository(): Repository {
    return {
        authCredentials: initMemoryAuthCredentialRepository({ stored: false }),
    }
}
function standardSimulator(): Simulator {
    return {
        login: {
            login: async (fields) => {
                if (fields.loginID !== VALID_LOGIN_ID || fields.password !== VALID_PASSWORD) {
                    throw { type: "invalid-password-login" }
                }
                return {
                    ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
                    apiCredential: markApiCredential({ apiRoles: ["role"] }),
                    loginAt: markLoginAt(SUCCEED_TO_LOGIN_AT),
                }
            },
        },
    }
}
