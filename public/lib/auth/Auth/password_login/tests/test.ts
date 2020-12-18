import { wait } from "../../../../z_external/delayed"

import { Config, newPasswordLoginResource, Repository, Simulator } from "./core"

import { initMemoryAuthCredentialRepository } from "../../../common/credential/impl/repository/auth_credential/memory"

import { PasswordLoginState } from "../component"

import { markScriptPath } from "../../../common/application/data"
import {
    AuthCredential,
    markApiCredential,
    markLoginAt,
    markTicketNonce,
} from "../../../common/credential/data"
import { markInputValue } from "../../../common/field/data"
import { LoginFields } from "../../../login/password_login/data"
import { AuthCredentialRepository } from "../../../common/credential/infra"

const VALID_LOGIN = { loginID: "login-id", password: "password" } as const
//const INVALID_LOGIN = { loginID: "invalid-login-id", password: "invalid-password" } as const

const AUTHORIZED_TICKET_NONCE = "ticket-nonce" as const
const SUCCEED_TO_LOGIN_AT = new Date("2020-01-01 10:00:00")

describe("PasswordLogin", () => {
    test("submit valid login-id and password", (done) => {
        const currentURL: URL = new URL("https://example.com/index.html")
        const config = standardConfig()
        const repository = standardRepository()
        const simulator = standardSimulator()
        const resource = newPasswordLoginResource(currentURL, config, repository, simulator)

        resource.passwordLogin.onStateChange(stateHandler())

        resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))
        resource.passwordField.set(markInputValue(VALID_LOGIN.password))

        resource.passwordLogin.login()

        function stateHandler(): Post<PasswordLoginState> {
            const stack: PasswordLoginState[] = []
            return (state) => {
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
                        expectToSaveLastLogin(repository.authCredentials)
                        done()
                        break

                    case "failed-to-login":
                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break
                }
            }
        }
    })

    test("submit valid login-id and password; with delayed", (done) => {
        const currentURL: URL = new URL("https://example.com/index.html")
        const config = standardConfig()
        const repository = standardRepository()
        const simulator = waitSimulator({ wait_millisecond: 2 }) // wait for delayed timeout
        const resource = newPasswordLoginResource(currentURL, config, repository, simulator)

        resource.passwordLogin.onStateChange(stateHandler())

        resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))
        resource.passwordField.set(markInputValue(VALID_LOGIN.password))

        resource.passwordLogin.login()

        function stateHandler(): Post<PasswordLoginState> {
            const stack: PasswordLoginState[] = []
            return (state) => {
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
                            { type: "delayed-to-login" }, // delayed event
                            {
                                type: "succeed-to-login",
                                scriptPath: markScriptPath("//secure.example.com/index.js"),
                            },
                        ])
                        expectToSaveLastLogin(repository.authCredentials)
                        done()
                        break

                    case "failed-to-login":
                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break
                }
            }
        }
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
                delay: { delay_millisecond: 1 },
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
                return simulateLogin(fields)
            },
        },
    }
}
function waitSimulator(waitTime: WaitTime): Simulator {
    return {
        login: {
            login: async (fields) => {
                await wait(waitTime, () => null)
                return simulateLogin(fields)
            },
        },
    }
}

async function simulateLogin(fields: LoginFields): Promise<AuthCredential | null> {
    if (fields.loginID !== VALID_LOGIN.loginID || fields.password !== VALID_LOGIN.password) {
        return null
    }
    return {
        ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
        apiCredential: markApiCredential({ apiRoles: ["role"] }),
        loginAt: markLoginAt(SUCCEED_TO_LOGIN_AT),
    }
}

function expectToSaveLastLogin(authCredentials: AuthCredentialRepository) {
    expect(authCredentials.findLastLogin()).toEqual({
        success: true,
        found: true,
        lastLogin: {
            ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
            lastLoginAt: markLoginAt(SUCCEED_TO_LOGIN_AT),
        },
    })
}

interface Post<T> {
    (state: T): void
}

type WaitTime = { wait_millisecond: number }
