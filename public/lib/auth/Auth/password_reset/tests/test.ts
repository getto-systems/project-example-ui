import { wait } from "../../../../z_external/delayed"

import { Config, newPasswordResetResource, Repository, Simulator } from "./core"

import { initMemoryAuthCredentialRepository } from "../../../login/renew/impl/repository/auth_credential/memory"
import { RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"
import { initStaticClock } from "../../../login/renew/impl/clock/simulate"

import { AuthCredentialRepository, Clock } from "../../../login/renew/infra"

import { PasswordResetState } from "../component"
import { LoginIDFieldState } from "../../field/login_id/component"
import { PasswordFieldState } from "../../field/password/component"

import { markScriptPath } from "../../../common/application/data"
import {
    AuthCredential,
    markApiCredential,
    markLoginAt,
    markTicketNonce,
} from "../../../common/credential/data"
import { hasError, markInputValue, noError } from "../../../common/field/data"
import { ResetFields, ResetToken } from "../../../profile/password_reset/data"

const VALID_LOGIN = { loginID: "login-id", password: "password" } as const

const AUTHORIZED_TICKET_NONCE = "ticket-nonce" as const
const SUCCEED_TO_LOGIN_AT = new Date("2020-01-01 10:00:00")

const RENEWED_TICKET_NONCE = "renewed-ticket-nonce" as const
const SUCCEED_TO_RENEW_AT = new Date("2020-01-01 10:01:00")

// renew リクエストを投げるべきかの判定に使用する
// SUCCEED_TO_LOGIN_AT と setContinuousRenew の delay との間でうまく調整する
const NOW = new Date("2020-01-01 10:00:30")

describe("PasswordReset", () => {
    test("submit valid login-id and password", (done) => {
        const { repository, resource } = standardPasswordResetResource()

        resource.passwordReset.onStateChange(stateHandler())

        resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))
        resource.passwordField.set(markInputValue(VALID_LOGIN.password))

        resource.passwordReset.reset()

        function stateHandler(): Post<PasswordResetState> {
            const stack: PasswordResetState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-reset":
                    case "try-to-reset":
                    case "delayed-to-reset":
                        // work in progress...
                        break

                    case "try-to-load":
                        expect(stack).toEqual([
                            { type: "try-to-reset" },
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

                    case "failed-to-reset":
                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("submit valid login-id and password; with delayed", (done) => {
        // wait for delayed timeout
        const { repository, resource } = waitPasswordResetResource()

        resource.passwordReset.onStateChange(stateHandler())

        resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))
        resource.passwordField.set(markInputValue(VALID_LOGIN.password))

        resource.passwordReset.reset()

        function stateHandler(): Post<PasswordResetState> {
            const stack: PasswordResetState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-reset":
                    case "try-to-reset":
                    case "delayed-to-reset":
                        // work in progress...
                        break

                    case "try-to-load":
                        expect(stack).toEqual([
                            { type: "try-to-reset" },
                            { type: "delayed-to-reset" }, // delayed event
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

                    case "failed-to-reset":
                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("submit without fields", (done) => {
        const { repository, resource } = standardPasswordResetResource()

        resource.passwordReset.onStateChange(stateHandler())

        // try to reset without fields
        //resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))
        //resource.passwordField.set(markInputValue(VALID_LOGIN.password))

        resource.passwordReset.reset()

        function stateHandler(): Post<PasswordResetState> {
            const stack: PasswordResetState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-reset":
                    case "try-to-reset":
                    case "delayed-to-reset":
                        // work in progress...
                        break

                    case "try-to-load":
                        done(new Error(state.type))
                        break

                    case "failed-to-reset":
                        expect(stack).toEqual([
                            { type: "failed-to-reset", err: { type: "validation-error" } },
                        ])
                        expectToEmptyLastLogin(repository.authCredentials)
                        done()
                        break

                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("submit without resetToken", (done) => {
        const { repository, resource } = emptyResetTokenPasswordResetResource()

        resource.passwordReset.onStateChange(stateHandler())

        resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))
        resource.passwordField.set(markInputValue(VALID_LOGIN.password))

        resource.passwordReset.reset()

        function stateHandler(): Post<PasswordResetState> {
            const stack: PasswordResetState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-reset":
                    case "try-to-reset":
                    case "delayed-to-reset":
                        // work in progress...
                        break

                    case "try-to-load":
                        done(new Error(state.type))
                        break

                    case "failed-to-reset":
                        expect(stack).toEqual([
                            { type: "failed-to-reset", err: { type: "empty-reset-token" } },
                        ])
                        expectToEmptyLastLogin(repository.authCredentials)
                        done()
                        break

                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("load error", (done) => {
        const { resource } = standardPasswordResetResource()

        resource.passwordReset.onStateChange(stateHandler())

        resource.passwordReset.loadError({ type: "infra-error", err: "load error" })

        function stateHandler(): Post<PasswordResetState> {
            const stack: PasswordResetState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-reset":
                    case "try-to-reset":
                    case "delayed-to-reset":
                        // work in progress...
                        break

                    case "try-to-load":
                        done(new Error(state.type))
                        break

                    case "failed-to-reset":
                    case "storage-error":
                    case "error":
                        done(new Error(state.type))
                        break

                    case "load-error":
                        expect(stack).toEqual([
                            { type: "load-error", err: { type: "infra-error", err: "load error" } },
                        ])
                        done()
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    describe("fields", () => {
        describe("loginID", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordResetResource()

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
                const { resource } = standardPasswordResetResource()

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
                const { resource } = standardPasswordResetResource()

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
                const { resource } = standardPasswordResetResource()

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
                const { resource } = standardPasswordResetResource()

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
                const { resource } = standardPasswordResetResource()

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

            test("show/hide password", (done) => {
                const { resource } = standardPasswordResetResource()

                resource.passwordField.onStateChange(stateHandler())

                resource.passwordField.set(markInputValue("password"))
                resource.passwordField.show()
                resource.passwordField.hide()

                function stateHandler(): Post<PasswordFieldState> {
                    const stack: PasswordFieldState[] = []
                    return (state) => {
                        stack.push(state)

                        if (stack.length === 3) {
                            expect(stack[1]).toMatchObject({
                                type: "succeed-to-update",
                                view: { show: true, password: "password" },
                            })
                            expect(stack[2]).toMatchObject({
                                type: "succeed-to-update",
                                view: { show: false },
                            })
                            done()
                        }
                    }
                }
            })
        })
    })
})

function standardPasswordResetResource() {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newPasswordResetResource(currentURL, config, repository, simulator, clock)

    return { repository, resource }
}
function waitPasswordResetResource() {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = standardRepository()
    const simulator = waitSimulator()
    const clock = standardClock()
    const resource = newPasswordResetResource(currentURL, config, repository, simulator, clock)

    return { repository, resource }
}
function emptyResetTokenPasswordResetResource() {
    const currentURL = emptyResetTokenURL()
    const config = standardConfig()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newPasswordResetResource(currentURL, config, repository, simulator, clock)

    return { repository, resource }
}

function standardURL(): URL {
    return new URL("https://example.com/index.html?_password_reset_token=reset-token")
}
function emptyResetTokenURL(): URL {
    return new URL("https://example.com/index.html")
}
function standardConfig(): Config {
    return {
        application: {
            secureScriptPath: {
                secureServerHost: "secure.example.com",
            },
        },
        passwordReset: {
            reset: {
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
        reset: {
            reset: async (resetToken, fields) => {
                return simulateReset(resetToken, fields)
            },
        },
        renew: renewSimulator(),
    }
}
function waitSimulator(): Simulator {
    return {
        reset: {
            reset: async (resetToken, fields) => {
                // wait for delayed timeout
                await wait({ wait_millisecond: 3 }, () => null)
                return simulateReset(resetToken, fields)
            },
        },
        renew: renewSimulator(),
    }
}

function simulateReset(_resetToken: ResetToken, _fields: ResetFields): AuthCredential {
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

function standardClock(): Clock {
    return initStaticClock(NOW)
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

function assertNever(_: never): never {
    throw new Error("NEVER")
}
