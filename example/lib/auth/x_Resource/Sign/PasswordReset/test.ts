import { initPasswordResetResource } from "./impl"

import { initLoginLocationInfo } from "../../common/LocationInfo/impl"

import { initStaticClock, StaticClock } from "../../../../z_infra/clock/simulate"
import { initRenewSimulateRemoteAccess } from "../../../sign/authCredential/common/infra/remote/renew/simulate"
import { initResetSimulateRemoteAccess } from "../../../sign/passwordReset/impl/remote/reset/simulate"

import { initFormAction } from "../../../../common/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../common/auth/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../common/auth/field/password/main/password"
import { initTestPasswordResetAction } from "../../../sign/passwordReset/tests/reset"

import { Clock } from "../../../../z_infra/clock/infra"
import { ResetRemoteAccess, ResetRemoteAccessResult } from "../../../sign/passwordReset/infra"

import { PasswordResetResource } from "./resource"

import { ResetComponentState } from "./Reset/component"

import { markScriptPath } from "../../../sign/location/data"
import { markInputString, toValidationError } from "../../../../common/getto-form/form/data"
import { markAuthAt, markTicketNonce } from "../../../sign/authCredential/common/data"
import { initMemoryApiCredentialRepository } from "../../../../common/auth/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../../common/auth/apiCredential/data"
import { ApiCredentialRepository } from "../../../../common/auth/apiCredential/infra"
import {
    AuthCredentialRepository,
    RenewRemoteAccess,
    RenewRemoteAccessResult,
} from "../../../sign/authCredential/common/infra"
import { initContinuousRenewActionPod } from "../../../sign/authCredential/continuousRenew/impl"
import { initMemoryAuthCredentialRepository } from "../../../sign/authCredential/common/infra/repository/memory"
import { initLocationActionPod } from "../../../sign/location/impl"

const VALID_LOGIN = { loginID: "login-id", password: "password" } as const

const AUTHORIZED_TICKET_NONCE = "ticket-nonce" as const
const SUCCEED_TO_LOGIN_AT = new Date("2020-01-01 10:00:00")

const RENEWED_TICKET_NONCE = "renewed-ticket-nonce" as const
const SUCCEED_TO_RENEW_AT = new Date("2020-01-01 10:01:00")

// renew リクエストを投げるべきかの判定に使用する
// SUCCEED_TO_LOGIN_AT と setContinuousRenew の delay との間でうまく調整する
const NOW = new Date("2020-01-01 10:00:30")

// continuous renew リクエストを投げるべきかの判定に使用する
// テストが完了したら clock が返す値をこっちにする
const COMPLETED_NOW = new Date("2020-01-01 11:00:00")

describe("PasswordReset", () => {
    test("submit valid login-id and password", (done) => {
        const { repository, clock, resource } = standardPasswordResetResource()

        resource.reset.addStateHandler(initChecker())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        resource.form.loginID.input.change()

        resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        resource.form.password.input.change()

        resource.reset.submit(resource.form.getResetFields())

        function initChecker() {
            return initAsyncStateChecker(
                (state: ResetComponentState): boolean => {
                    switch (state.type) {
                        case "initial-reset":
                        case "try-to-reset":
                        case "delayed-to-reset":
                            // work in progress...
                            return false

                        case "try-to-load":
                            return true

                        case "failed-to-reset":
                        case "storage-error":
                        case "load-error":
                        case "error":
                            throw new Error(state.type)
                    }
                },
                (stack) => {
                    clock.update(COMPLETED_NOW)
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
                }
            )
        }
    })

    test("submit valid login-id and password; with delayed", (done) => {
        // wait for delayed timeout
        const { repository, clock, resource } = waitPasswordResetResource()

        resource.reset.addStateHandler(initChecker())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        resource.form.loginID.input.change()

        resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        resource.form.password.input.change()

        resource.reset.submit(resource.form.getResetFields())

        function initChecker() {
            return initAsyncStateChecker(
                (state: ResetComponentState): boolean => {
                    switch (state.type) {
                        case "initial-reset":
                        case "try-to-reset":
                        case "delayed-to-reset":
                            // work in progress...
                            return false

                        case "try-to-load":
                            return true

                        case "failed-to-reset":
                        case "storage-error":
                        case "load-error":
                        case "error":
                            throw new Error(state.type)
                    }
                },
                (stack) => {
                    clock.update(COMPLETED_NOW)
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
                }
            )
        }
    })

    test("submit without fields", (done) => {
        const { repository, resource } = standardPasswordResetResource()

        resource.reset.addStateHandler(initChecker())

        // try to reset without fields
        //resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))
        //resource.passwordField.set(markInputValue(VALID_LOGIN.password))

        resource.reset.submit(resource.form.getResetFields())

        function initChecker() {
            return initAsyncStateChecker(
                (state: ResetComponentState): boolean => {
                    switch (state.type) {
                        case "initial-reset":
                        case "try-to-reset":
                        case "delayed-to-reset":
                            // work in progress...
                            return false

                        case "try-to-load":
                            throw new Error(state.type)

                        case "failed-to-reset":
                            return true

                        case "storage-error":
                        case "load-error":
                        case "error":
                            throw new Error(state.type)
                    }
                },
                (stack) => {
                    expect(stack).toEqual([
                        { type: "failed-to-reset", err: { type: "validation-error" } },
                    ])
                    expectToEmptyLastLogin(repository.authCredentials)
                    done()
                }
            )
        }
    })

    test("submit without resetToken", (done) => {
        const { repository, resource } = emptyResetTokenPasswordResetResource()

        resource.reset.addStateHandler(initChecker())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        resource.form.loginID.input.change()

        resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        resource.form.password.input.change()

        resource.reset.submit(resource.form.getResetFields())

        function initChecker() {
            return initAsyncStateChecker(
                (state: ResetComponentState): boolean => {
                    switch (state.type) {
                        case "initial-reset":
                        case "try-to-reset":
                        case "delayed-to-reset":
                            // work in progress...
                            return false

                        case "try-to-load":
                            throw new Error(state.type)

                        case "failed-to-reset":
                            return true

                        case "storage-error":
                        case "load-error":
                        case "error":
                            throw new Error(state.type)
                    }
                },
                (stack) => {
                    expect(stack).toEqual([
                        { type: "failed-to-reset", err: { type: "empty-reset-token" } },
                    ])
                    expectToEmptyLastLogin(repository.authCredentials)
                    done()
                }
            )
        }
    })

    test("load error", (done) => {
        const { resource } = standardPasswordResetResource()

        resource.reset.addStateHandler(initChecker())

        resource.reset.loadError({ type: "infra-error", err: "load error" })

        function initChecker() {
            return initAsyncStateChecker(
                (state: ResetComponentState): boolean => {
                    switch (state.type) {
                        case "initial-reset":
                        case "try-to-reset":
                        case "delayed-to-reset":
                            // work in progress...
                            return false

                        case "try-to-load":
                            throw new Error(state.type)

                        case "failed-to-reset":
                        case "storage-error":
                        case "error":
                            throw new Error(state.type)

                        case "load-error":
                            return true
                    }
                },
                (stack) => {
                    expect(stack).toEqual([
                        { type: "load-error", err: { type: "infra-error", err: "load error" } },
                    ])
                    done()
                }
            )
        }
    })

    describe("form", () => {
        test("initial without input field", (done) => {
            const { resource } = standardPasswordResetResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            expect(resource.form.getResetFields()).toEqual({ success: false })

            checker.test()
            done()

            function initChecker() {
                return initSyncStateChecker((stack) => {
                    expect(stack).toEqual([
                        {
                            validation: "invalid",
                            history: { undo: false, redo: false },
                        },
                        {
                            validation: "invalid",
                            history: { undo: false, redo: false },
                        },
                    ])
                })
            }
        })

        test("valid with input valid field", (done) => {
            const { resource } = standardPasswordResetResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
            resource.form.loginID.input.change()

            resource.form.password.input.input(markInputString(VALID_LOGIN.password))
            resource.form.password.input.change()

            expect(resource.form.getResetFields()).toEqual({
                success: true,
                value: {
                    loginID: VALID_LOGIN.loginID,
                    password: VALID_LOGIN.password,
                },
            })

            checker.test()
            done()

            function initChecker() {
                return initSyncStateChecker((stack) => {
                    expect(stack).toEqual([
                        {
                            validation: "initial",
                            history: { undo: false, redo: false },
                        },
                        {
                            validation: "initial",
                            history: { undo: true, redo: false },
                        },
                        {
                            validation: "valid",
                            history: { undo: true, redo: false },
                        },
                        {
                            validation: "valid",
                            history: { undo: true, redo: false },
                        },
                        {
                            validation: "valid",
                            history: { undo: true, redo: false },
                        },
                        {
                            validation: "valid",
                            history: { undo: true, redo: false },
                        },
                    ])
                })
            }
        })

        test("invalid with input invalid field", (done) => {
            const { resource } = standardPasswordResetResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString(""))
            resource.form.loginID.input.change()

            resource.form.password.input.input(markInputString(""))
            resource.form.password.input.change()

            expect(resource.form.getResetFields()).toEqual({ success: false })

            checker.test()
            done()

            function initChecker() {
                return initSyncStateChecker((stack) => {
                    expect(stack).toEqual([
                        {
                            validation: "invalid",
                            history: { undo: false, redo: false },
                        },
                        {
                            validation: "invalid",
                            history: { undo: false, redo: false },
                        },
                        {
                            validation: "invalid",
                            history: { undo: false, redo: false },
                        },
                        {
                            validation: "invalid",
                            history: { undo: false, redo: false },
                        },
                    ])
                })
            }
        })

        test("undo / redo", (done) => {
            const { resource } = standardPasswordResetResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.loginID.handler)
            resource.form.password.input.addStateHandler(checker.password.handler)

            resource.form.undo()

            resource.form.loginID.input.input(markInputString("loginID-a"))
            resource.form.loginID.input.change()

            resource.form.loginID.input.input(markInputString("loginID-b"))
            resource.form.loginID.input.change()

            resource.form.undo()

            resource.form.password.input.input(markInputString("password-a"))
            resource.form.password.input.change()

            resource.form.undo()
            resource.form.redo()

            resource.form.password.input.input(markInputString("password-b"))
            resource.form.password.input.change()

            resource.form.loginID.input.input(markInputString("loginID-c"))
            resource.form.loginID.input.change()

            resource.form.redo()

            checker.loginID.test()
            checker.password.test()
            done()

            function initChecker() {
                return {
                    loginID: initSyncStateChecker((stack) => {
                        expect(stack).toEqual([
                            { value: "loginID-a" },
                            { value: "loginID-b" },
                            { value: "loginID-a" },
                            { value: "loginID-c" },
                        ])
                    }),
                    password: initSyncStateChecker((stack) => {
                        expect(stack).toEqual([
                            { value: "password-a" },
                            { value: "" },
                            { value: "password-a" },
                            { value: "password-b" },
                        ])
                    }),
                }
            }
        })

        test("removeStateHandler", (done) => {
            const { resource } = standardPasswordResetResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)
            resource.form.loginID.input.removeStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString("loginID-a"))

            checker.test()
            done()

            function initChecker() {
                return initSyncStateChecker((stack) => {
                    expect(stack).toEqual([])
                })
            }
        })

        test("terminate", (done) => {
            const { resource } = standardPasswordResetResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)

            resource.form.terminate()

            resource.form.loginID.input.input(markInputString("loginID-a"))

            checker.test()
            done()

            function initChecker() {
                return initSyncStateChecker((stack) => {
                    expect(stack).toEqual([])
                })
            }
        })
    })

    describe("fields", () => {
        describe("loginID", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordResetResource()

                const checker = initChecker()
                resource.form.loginID.addStateHandler(checker.handler)

                resource.form.loginID.input.input(markInputString(""))

                checker.test()
                done()

                function initChecker() {
                    return initSyncStateChecker((stack) => {
                        expect(stack).toEqual([{ result: toValidationError(["empty"]) }])
                    })
                }
            })
        })

        describe("password", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordResetResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                resource.form.password.input.input(markInputString(""))

                checker.test()
                done()

                function initChecker() {
                    return initSyncStateChecker((stack) => {
                        expect(stack).toEqual([
                            {
                                result: toValidationError(["empty"]),
                                character: { complex: false },
                                view: { show: false },
                            },
                        ])
                    })
                }
            })

            test("invalid with too long string", (done) => {
                const { resource } = standardPasswordResetResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                resource.form.password.input.input(markInputString("a".repeat(73)))

                checker.test()
                done()

                function initChecker() {
                    return initSyncStateChecker((stack) => {
                        expect(stack).toEqual([
                            {
                                result: toValidationError(["too-long"]),
                                character: { complex: false },
                                view: { show: false },
                            },
                        ])
                    })
                }
            })

            test("invalid with too long string including multi-byte character", (done) => {
                const { resource } = standardPasswordResetResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                // "あ"(UTF8) is 3 bytes character
                resource.form.password.input.input(markInputString("あ".repeat(24) + "a"))

                checker.test()
                done()

                function initChecker() {
                    return initSyncStateChecker((stack) => {
                        expect(stack).toEqual([
                            {
                                result: toValidationError(["too-long"]),
                                character: { complex: true },
                                view: { show: false },
                            },
                        ])
                    })
                }
            })

            test("valid with just 72 byte string", (done) => {
                const { resource } = standardPasswordResetResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                resource.form.password.input.input(markInputString("a".repeat(72)))

                checker.test()
                done()

                function initChecker() {
                    return initSyncStateChecker((stack) => {
                        expect(stack).toEqual([
                            {
                                result: { valid: true },
                                character: { complex: false },
                                view: { show: false },
                            },
                        ])
                    })
                }
            })

            test("valid with just 72 byte string including multi-byte character", (done) => {
                const { resource } = standardPasswordResetResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                // "あ"(UTF8) is 3 bytes character
                resource.form.password.input.input(markInputString("あ".repeat(24)))

                checker.test()
                done()

                function initChecker() {
                    return initSyncStateChecker((stack) => {
                        expect(stack).toEqual([
                            {
                                result: { valid: true },
                                character: { complex: true },
                                view: { show: false },
                            },
                        ])
                    })
                }
            })

            test("show/hide password", (done) => {
                const { resource } = standardPasswordResetResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                resource.form.password.input.input(markInputString("password"))
                resource.form.password.show()
                resource.form.password.hide()

                checker.test()
                done()

                function initChecker() {
                    return initSyncStateChecker((stack) => {
                        expect(stack).toEqual([
                            {
                                result: { valid: true },
                                character: { complex: false },
                                view: { show: false },
                            },
                            {
                                result: { valid: true },
                                character: { complex: false },
                                view: { show: true, password: "password" },
                            },
                            {
                                result: { valid: true },
                                character: { complex: false },
                                view: { show: false },
                            },
                        ])
                    })
                }
            })
        })
    })
})

function standardPasswordResetResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newPasswordResetTestResource(currentURL, repository, simulator, clock)

    return { repository, clock, resource }
}
function waitPasswordResetResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = waitSimulator()
    const clock = standardClock()
    const resource = newPasswordResetTestResource(currentURL, repository, simulator, clock)

    return { repository, clock, resource }
}
function emptyResetTokenPasswordResetResource() {
    const currentURL = emptyResetTokenURL()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newPasswordResetTestResource(currentURL, repository, simulator, clock)

    return { repository, resource }
}

type PasswordResetTestRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
}>
type PasswordResetTestRemoteAccess = Readonly<{
    reset: ResetRemoteAccess
    renew: RenewRemoteAccess
}>

function newPasswordResetTestResource(
    currentURL: URL,
    repository: PasswordResetTestRepository,
    remote: PasswordResetTestRemoteAccess,
    clock: Clock
): PasswordResetResource {
    const config = standardConfig()
    return initPasswordResetResource(
        initLoginLocationInfo(currentURL),
        {
            initContinuousRenew: initContinuousRenewActionPod({
                ...repository,
                ...remote,
                config: config.continuousRenew,
                clock,
            }),
            initLocation: initLocationActionPod({ config: config.location }),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },
        },
        {
            reset: initTestPasswordResetAction(config.passwordReset, remote.reset),
        }
    )
}

function standardURL(): URL {
    return new URL("https://example.com/index.html?_password_reset_token=reset-token")
}
function emptyResetTokenURL(): URL {
    return new URL("https://example.com/index.html")
}
function standardConfig() {
    return {
        location: {
            secureServerHost: "secure.example.com",
        },
        passwordReset: {
            reset: {
                delay: { delay_millisecond: 1 },
            },
        },
        continuousRenew: {
            interval: { interval_millisecond: 1 },
            delay: { delay_millisecond: 1 },
        },
    }
}
function standardRepository() {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: { apiNonce: markApiNonce("api-nonce"), apiRoles: markApiRoles(["role"]) },
        }),
        authCredentials: initMemoryAuthCredentialRepository({
            ticketNonce: { set: false },
            lastAuthAt: { set: false },
        }),
    }
}
function standardSimulator(): PasswordResetTestRemoteAccess {
    return {
        reset: initResetSimulateRemoteAccess(simulateReset, { wait_millisecond: 0 }),
        renew: renewRemoteAccess(),
    }
}
function waitSimulator(): PasswordResetTestRemoteAccess {
    return {
        reset: initResetSimulateRemoteAccess(simulateReset, { wait_millisecond: 3 }),
        renew: renewRemoteAccess(),
    }
}

function simulateReset(): ResetRemoteAccessResult {
    return {
        success: true,
        value: {
            auth: {
                ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
                authAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
            },
            api: { apiNonce: markApiNonce("api-nonce"), apiRoles: markApiRoles(["role"]) },
        },
    }
}
function renewRemoteAccess(): RenewRemoteAccess {
    let renewed = false
    return initRenewSimulateRemoteAccess(
        (): RenewRemoteAccessResult => {
            if (renewed) {
                // 最初の一回だけ renew して、あとは renew を cancel するために null を返す
                return { success: false, err: { type: "invalid-ticket" } }
            }
            renewed = true

            return {
                success: true,
                value: {
                    auth: {
                        ticketNonce: markTicketNonce(RENEWED_TICKET_NONCE),
                        authAt: markAuthAt(SUCCEED_TO_RENEW_AT),
                    },
                    api: { apiNonce: markApiNonce("api-nonce"), apiRoles: markApiRoles(["role"]) },
                },
            }
        },
        { wait_millisecond: 0 }
    )
}

function standardClock(): StaticClock {
    return initStaticClock(NOW)
}

function expectToSaveLastLogin(authCredentials: AuthCredentialRepository) {
    expect(authCredentials.load()).toEqual({
        success: true,
        found: true,
        lastLogin: {
            ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
            lastAuthAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
        },
    })
}
function expectToSaveRenewed(authCredentials: AuthCredentialRepository) {
    expect(authCredentials.load()).toEqual({
        success: true,
        found: true,
        lastLogin: {
            ticketNonce: markTicketNonce(RENEWED_TICKET_NONCE),
            lastAuthAt: markAuthAt(SUCCEED_TO_RENEW_AT),
        },
    })
}
function expectToEmptyLastLogin(authCredentials: AuthCredentialRepository) {
    expect(authCredentials.load()).toEqual({
        success: true,
        found: false,
    })
}

function initAsyncStateChecker<S>(isFinish: { (state: S): boolean }, examine: { (stack: S[]): void }) {
    const stack: S[] = []

    return (state: S) => {
        stack.push(state)

        if (isFinish(state)) {
            examine(stack)
        }
    }
}

function initSyncStateChecker<S>(examine: { (stack: S[]): void }) {
    const stack: S[] = []

    return {
        handler: (state: S) => {
            stack.push(state)
        },
        test: () => {
            examine(stack)
        },
    }
}
