import { wait } from "../../../../z_external/delayed"

import { Config, newPasswordLoginResource, Repository, Simulator } from "./core"

import { initMemoryAuthCredentialRepository } from "../../../login/renew/impl/repository/auth_credential/memory"
import { RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"

import { AuthCredentialRepository } from "../../../login/renew/infra"

import { PasswordLoginState } from "../component"
import { LoginIDFieldState } from "../../field/login_id/component"

import { markScriptPath } from "../../../common/application/data"
import {
    AuthCredential,
    markApiCredential,
    markLoginAt,
    markTicketNonce,
} from "../../../common/credential/data"
import { hasError, markInputValue, noError } from "../../../common/field/data"
import { LoginFields } from "../../../login/password_login/data"

import { PasswordFieldState } from "../../field/password/component"

const VALID_LOGIN = { loginID: "login-id", password: "password" } as const

const AUTHORIZED_TICKET_NONCE = "ticket-nonce" as const
const SUCCEED_TO_LOGIN_AT = new Date("2020-01-01 10:00:00")

const RENEWED_TICKET_NONCE = "renewed-ticket-nonce" as const
const SUCCEED_TO_RENEW_AT = new Date("2020-01-01 10:01:00")

describe("PasswordLogin", () => {
    test("submit valid login-id and password", (done) => {
        const { repository, resource } = standardPasswordLoginResource()

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

                    case "try-to-load":
                        expect(stack).toEqual([
                            { type: "try-to-login" },
                            {
                                type: "try-to-load",
                                scriptPath: markScriptPath("//secure.example.com/index.js"),
                            },
                        ])
                        expectToSaveLastLogin(repository.authCredentials)
                        setTimeout(() => {
                            expectToSaveRenewed(repository.authCredentials)
                            done()
                        }, 1) // after setContinuousRenew interval and delay
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
        // wait for delayed timeout
        const { repository, resource } = waitPasswordLoginResource({ wait_millisecond: 2 })

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

                    case "try-to-load":
                        expect(stack).toEqual([
                            { type: "try-to-login" },
                            { type: "delayed-to-login" }, // delayed event
                            {
                                type: "try-to-load",
                                scriptPath: markScriptPath("//secure.example.com/index.js"),
                            },
                        ])
                        expectToSaveLastLogin(repository.authCredentials)
                        setTimeout(() => {
                            expectToSaveRenewed(repository.authCredentials)
                            done()
                        }, 1) // after setContinuousRenew interval and delay
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

    test("submit without fields", (done) => {
        const { repository, resource } = standardPasswordLoginResource()

        resource.passwordLogin.onStateChange(stateHandler())

        // try to login without fields
        //resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))
        //resource.passwordField.set(markInputValue(VALID_LOGIN.password))

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

                    case "try-to-load":
                        done(new Error(state.type))
                        break

                    case "failed-to-login":
                        expect(stack).toEqual([
                            { type: "failed-to-login", err: { type: "validation-error" } },
                        ])
                        expectToEmptyLastLogin(repository.authCredentials)
                        done()
                        break

                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break
                }
            }
        }
    })

    describe("fields", () => {
        describe("loginID", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.loginIDField.onStateChange(stateHandler())

                resource.loginIDField.set(markInputValue(""))

                function stateHandler(): Post<LoginIDFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            type: "succeed-to-update",
                            result: hasError(["empty"]),
                        })
                        done()
                    }
                }
            })
        })

        describe("password", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.passwordField.onStateChange(stateHandler())

                resource.passwordField.set(markInputValue(""))

                function stateHandler(): Post<PasswordFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            type: "succeed-to-update",
                            result: hasError(["empty"]),
                        })
                        done()
                    }
                }
            })

            test("invalid with too long string", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.passwordField.onStateChange(stateHandler())

                resource.passwordField.set(markInputValue("a".repeat(73)))

                function stateHandler(): Post<PasswordFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            type: "succeed-to-update",
                            result: hasError(["too-long"]),
                        })
                        done()
                    }
                }
            })

            test("invalid with too long string including multi-byte character", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.passwordField.onStateChange(stateHandler())

                // "あ"(UTF8) is 3 bytes character
                resource.passwordField.set(markInputValue("あ".repeat(24) + "a"))

                function stateHandler(): Post<PasswordFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            type: "succeed-to-update",
                            result: hasError(["too-long"]),
                        })
                        done()
                    }
                }
            })

            test("valid with just 72 byte string", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.passwordField.onStateChange(stateHandler())

                resource.passwordField.set(markInputValue("a".repeat(72)))

                function stateHandler(): Post<PasswordFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            type: "succeed-to-update",
                            result: noError(),
                        })
                        done()
                    }
                }
            })

            test("valid with just 72 byte string including multi-byte character", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.passwordField.onStateChange(stateHandler())

                // "あ"(UTF8) is 3 bytes character
                resource.passwordField.set(markInputValue("あ".repeat(24)))

                function stateHandler(): Post<PasswordFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            type: "succeed-to-update",
                            result: noError(),
                        })
                        done()
                    }
                }
            })
        })
    })
})

function standardPasswordLoginResource() {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const resource = newPasswordLoginResource(currentURL, config, repository, simulator)

    return { repository, resource }
}
function waitPasswordLoginResource(waitTime: WaitTime) {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = standardRepository()
    const simulator = waitSimulator(waitTime)
    const resource = newPasswordLoginResource(currentURL, config, repository, simulator)

    return { repository, resource }
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
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
        setContinuousRenew: {
            setContinuousRenew: {
                interval: { interval_millisecond: 1 },
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
        renew: renewSimulator(),
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
        renew: renewSimulator(),
    }
}

async function simulateLogin(_fields: LoginFields): Promise<AuthCredential> {
    return {
        ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
        apiCredential: markApiCredential({ apiRoles: ["role"] }),
        loginAt: markLoginAt(SUCCEED_TO_LOGIN_AT),
    }
}
function renewSimulator(): RenewSimulator {
    let renewed = false
    return {
        renew: async () => {
            if (renewed) {
                // 最初の一回だけ renew して、あとは renew を cancel するために null を返す
                return null
            }
            renewed = true
            return {
                ticketNonce: markTicketNonce(RENEWED_TICKET_NONCE),
                apiCredential: markApiCredential({ apiRoles: ["role"] }),
                loginAt: markLoginAt(SUCCEED_TO_RENEW_AT),
            }
        },
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
function expectToSaveRenewed(authCredentials: AuthCredentialRepository) {
    expect(authCredentials.findLastLogin()).toEqual({
        success: true,
        found: true,
        lastLogin: {
            ticketNonce: markTicketNonce(RENEWED_TICKET_NONCE),
            lastLoginAt: markLoginAt(SUCCEED_TO_RENEW_AT),
        },
    })
}
function expectToEmptyLastLogin(authCredentials: AuthCredentialRepository) {
    expect(authCredentials.findLastLogin()).toEqual({
        success: true,
        found: false,
    })
}

interface Post<T> {
    (state: T): void
}

type WaitTime = { wait_millisecond: number }
