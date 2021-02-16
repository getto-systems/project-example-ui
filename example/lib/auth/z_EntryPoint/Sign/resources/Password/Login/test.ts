import { initAuthSignPasswordLoginResource } from "./impl"

import { initStaticClock, StaticClock } from "../../../../../../z_infra/clock/simulate"
import { initSubmitPasswordLoginSimulateRemoteAccess } from "../../../../../sign/password/login/infra/remote/submitPasswordLogin/simulate"
import { initRenewAuthCredentialSimulateRemoteAccess } from "../../../../../sign/authCredential/common/infra/remote/renewAuthCredential/simulate"

import { initFormAction } from "../../../../../../vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../../common/field/password/main/password"

import {
    SubmitPasswordLoginRemoteAccess,
    SubmitLoginRemoteAccessResult,
} from "../../../../../sign/password/login/infra"
import { Clock } from "../../../../../../z_infra/clock/infra"

import { AuthSignPasswordLoginResource } from "./resource"

import { PasswordLoginComponentState } from "../../../../../sign/x_Component/Password/Login/Core/component"

import { markInputString, toValidationError } from "../../../../../../vendor/getto-form/form/data"
import { markSecureScriptPath } from "../../../../../sign/authLocation/data"
import { PasswordLoginFields } from "../../../../../sign/password/login/data"
import { markAuthAt, markTicketNonce } from "../../../../../sign/authCredential/common/data"
import { ApiCredentialRepository } from "../../../../../../common/apiCredential/infra"
import { initMemoryApiCredentialRepository } from "../../../../../../common/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../../../../common/apiCredential/data"
import { initContinuousRenewAuthCredentialAction } from "../../../../../sign/authCredential/continuousRenew/impl"
import {
    AuthCredentialRepository,
    RenewAuthCredentialRemoteAccess,
    RenewAuthCredentialRemoteAccessResult,
} from "../../../../../sign/authCredential/common/infra"
import { initMemoryAuthCredentialRepository } from "../../../../../sign/authCredential/common/infra/repository/authCredential/memory"
import {
    initAuthLocationAction,
    initAuthLocationActionLocationInfo,
} from "../../../../../sign/authLocation/impl"
import { delayed } from "../../../../../../z_infra/delayed/core"
import {
    initPasswordLoginAction,
    initPasswordLoginActionPod,
    submitEventHasDone,
} from "../../../../../sign/password/login/impl"
import {
    initAsyncComponentStateTester,
    initSyncComponentTestChecker,
} from "../../../../../../vendor/getto-example/Application/testHelper"

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

describe("PasswordLogin", () => {
    test("submit valid login-id and password", (done) => {
        const { repository, clock, resource } = standardPasswordLoginResource()

        resource.login.addStateHandler(initTester())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        resource.form.loginID.input.change()

        resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        resource.form.password.input.change()

        resource.login.submit(resource.form.getLoginFields())

        function initTester() {
            return initAsyncTester()((stack) => {
                clock.update(COMPLETED_NOW)
                expect(stack).toEqual([
                    { type: "try-to-login" },
                    {
                        type: "try-to-load",
                        scriptPath: markSecureScriptPath("//secure.example.com/index.js"),
                    },
                ])
                expectToSaveLastLogin(repository.authCredentials)
                setTimeout(() => {
                    expectToSaveRenewed(repository.authCredentials)
                    done()
                }, 1) // after setContinuousRenew interval and delay
            })
        }
    })

    test("submit valid login-id and password; with delayed", (done) => {
        // wait for delayed timeout
        const { repository, clock, resource } = waitPasswordLoginResource()

        resource.login.addStateHandler(initTester())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        resource.form.loginID.input.change()

        resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        resource.form.password.input.change()

        resource.login.submit(resource.form.getLoginFields())

        function initTester() {
            return initAsyncTester()((stack) => {
                clock.update(COMPLETED_NOW)
                expect(stack).toEqual([
                    { type: "try-to-login" },
                    { type: "delayed-to-login" }, // delayed event
                    {
                        type: "try-to-load",
                        scriptPath: markSecureScriptPath("//secure.example.com/index.js"),
                    },
                ])
                expectToSaveLastLogin(repository.authCredentials)
                setTimeout(() => {
                    expectToSaveRenewed(repository.authCredentials)
                    done()
                }, 1) // after setContinuousRenew interval and delay
            })
        }
    })

    test("submit without fields", (done) => {
        const { repository, resource } = standardPasswordLoginResource()

        resource.login.addStateHandler(initTester())

        // try to login without fields
        // resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        // resource.form.loginID.input.change()

        // resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        // resource.form.password.input.change()

        resource.login.submit(resource.form.getLoginFields())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([{ type: "failed-to-login", err: { type: "validation-error" } }])
                expectToEmptyLastLogin(repository.authCredentials)
                done()
            })
        }
    })

    test("load error", (done) => {
        const { resource } = standardPasswordLoginResource()

        resource.login.addStateHandler(initTester())

        resource.login.loadError({ type: "infra-error", err: "load error" })

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "load-error", err: { type: "infra-error", err: "load error" } },
                ])
                done()
            })
        }
    })

    describe("form", () => {
        test("initial without input field", (done) => {
            const { resource } = standardPasswordLoginResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            expect(resource.form.getLoginFields()).toEqual({ success: false })

            checker.done()

            function initChecker() {
                return initSyncComponentTestChecker((stack) => {
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
                    done()
                })
            }
        })

        test("valid with input valid field", (done) => {
            const { resource } = standardPasswordLoginResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
            resource.form.loginID.input.change()

            resource.form.password.input.input(markInputString(VALID_LOGIN.password))
            resource.form.password.input.change()

            expect(resource.form.getLoginFields()).toEqual({
                success: true,
                value: {
                    loginID: VALID_LOGIN.loginID,
                    password: VALID_LOGIN.password,
                },
            })

            checker.done()

            function initChecker() {
                return initSyncComponentTestChecker((stack) => {
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
                    done()
                })
            }
        })

        test("invalid with input invalid field", (done) => {
            const { resource } = standardPasswordLoginResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString(""))
            resource.form.loginID.input.change()

            resource.form.password.input.input(markInputString(""))
            resource.form.password.input.change()

            expect(resource.form.getLoginFields()).toEqual({ success: false })

            checker.done()

            function initChecker() {
                return initSyncComponentTestChecker((stack) => {
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
                    done()
                })
            }
        })

        test("undo / redo", (done) => {
            const { resource } = standardPasswordLoginResource()

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

            checker.loginID.done()
            checker.password.done()
            checker.main.done()

            function initChecker() {
                const result = { loginID: false, password: false }
                return {
                    main: initSyncComponentTestChecker(() => {
                        expect(result).toEqual({ loginID: true, password: true })
                        done()
                    }),
                    loginID: initSyncComponentTestChecker((stack) => {
                        expect(stack).toEqual([
                            { value: "loginID-a" },
                            { value: "loginID-b" },
                            { value: "loginID-a" },
                            { value: "loginID-c" },
                        ])
                        result.loginID = true
                    }),
                    password: initSyncComponentTestChecker((stack) => {
                        expect(stack).toEqual([
                            { value: "password-a" },
                            { value: "" },
                            { value: "password-a" },
                            { value: "password-b" },
                        ])
                        result.password = true
                    }),
                }
            }
        })

        test("removeStateHandler", (done) => {
            const { resource } = standardPasswordLoginResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)
            resource.form.loginID.input.removeStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString("loginID-a"))

            checker.done()

            function initChecker() {
                return initSyncComponentTestChecker((stack) => {
                    expect(stack).toEqual([])
                    done()
                })
            }
        })

        test("terminate", (done) => {
            const { resource } = standardPasswordLoginResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)

            resource.form.terminate()

            resource.form.loginID.input.input(markInputString("loginID-a"))

            checker.done()

            function initChecker() {
                return initSyncComponentTestChecker((stack) => {
                    expect(stack).toEqual([])
                    done()
                })
            }
        })
    })

    describe("fields", () => {
        describe("loginID", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordLoginResource()

                const checker = initChecker()
                resource.form.loginID.addStateHandler(checker.handler)

                resource.form.loginID.input.input(markInputString(""))

                checker.done()

                function initChecker() {
                    return initSyncComponentTestChecker((stack) => {
                        expect(stack).toEqual([{ result: toValidationError(["empty"]) }])
                        done()
                    })
                }
            })
        })

        describe("password", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordLoginResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                resource.form.password.input.input(markInputString(""))

                checker.done()

                function initChecker() {
                    return initSyncComponentTestChecker((stack) => {
                        expect(stack).toEqual([
                            {
                                result: toValidationError(["empty"]),
                                character: { complex: false },
                                view: { show: false },
                            },
                        ])
                        done()
                    })
                }
            })

            test("invalid with too long string", (done) => {
                const { resource } = standardPasswordLoginResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                resource.form.password.input.input(markInputString("a".repeat(73)))

                checker.done()

                function initChecker() {
                    return initSyncComponentTestChecker((stack) => {
                        expect(stack).toEqual([
                            {
                                result: toValidationError(["too-long"]),
                                character: { complex: false },
                                view: { show: false },
                            },
                        ])
                        done()
                    })
                }
            })

            test("invalid with too long string including multi-byte character", (done) => {
                const { resource } = standardPasswordLoginResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                // "あ"(UTF8) is 3 bytes character
                resource.form.password.input.input(markInputString("あ".repeat(24) + "a"))

                checker.done()

                function initChecker() {
                    return initSyncComponentTestChecker((stack) => {
                        expect(stack).toEqual([
                            {
                                result: toValidationError(["too-long"]),
                                character: { complex: true },
                                view: { show: false },
                            },
                        ])
                        done()
                    })
                }
            })

            test("valid with just 72 byte string", (done) => {
                const { resource } = standardPasswordLoginResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                resource.form.password.input.input(markInputString("a".repeat(72)))

                checker.done()

                function initChecker() {
                    return initSyncComponentTestChecker((stack) => {
                        expect(stack).toEqual([
                            {
                                result: { valid: true },
                                character: { complex: false },
                                view: { show: false },
                            },
                        ])
                        done()
                    })
                }
            })

            test("valid with just 72 byte string including multi-byte character", (done) => {
                const { resource } = standardPasswordLoginResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                // "あ"(UTF8) is 3 bytes character
                resource.form.password.input.input(markInputString("あ".repeat(24)))

                checker.done()

                function initChecker() {
                    return initSyncComponentTestChecker((stack) => {
                        expect(stack).toEqual([
                            {
                                result: { valid: true },
                                character: { complex: true },
                                view: { show: false },
                            },
                        ])
                        done()
                    })
                }
            })

            test("show/hide password", (done) => {
                const { resource } = standardPasswordLoginResource()

                const checker = initChecker()
                resource.form.password.addStateHandler(checker.handler)

                resource.form.password.input.input(markInputString("password"))
                resource.form.password.show()
                resource.form.password.hide()

                checker.done()

                function initChecker() {
                    return initSyncComponentTestChecker((stack) => {
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
                        done()
                    })
                }
            })
        })
    })
})

function standardPasswordLoginResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newTestPasswordLoginResource(currentURL, repository, simulator, clock)

    return { repository, clock, resource }
}
function waitPasswordLoginResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = waitSimulator()
    const clock = standardClock()
    const resource = newTestPasswordLoginResource(currentURL, repository, simulator, clock)

    return { repository, clock, resource }
}

type PasswordLoginTestRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
}>
type PasswordLoginTestRemoteAccess = Readonly<{
    login: SubmitPasswordLoginRemoteAccess
    renew: RenewAuthCredentialRemoteAccess
}>

function newTestPasswordLoginResource(
    currentURL: URL,
    repository: PasswordLoginTestRepository,
    remote: PasswordLoginTestRemoteAccess,
    clock: Clock
): AuthSignPasswordLoginResource {
    const config = standardConfig()
    return initAuthSignPasswordLoginResource({
        login: {
            continuousRenew: initContinuousRenewAuthCredentialAction({
                ...repository,
                ...remote,
                config: config.continuousRenew,
                clock,
            }),
            location: initAuthLocationAction(initAuthLocationActionLocationInfo(currentURL), {
                config: config.location,
            }),
            login: initPasswordLoginAction(
                initPasswordLoginActionPod({
                    ...remote,
                    config: config.login,
                    delayed,
                })
            ),
        },

        form: formMaterial(),
    })

    function formMaterial() {
        const form = initFormAction()
        const loginID = initLoginIDFormFieldAction()
        const password = initPasswordFormFieldAction()
        return {
            validation: form.validation(),
            history: form.history(),
            loginID: loginID.field(),
            password: password.field(),
            character: password.character(),
            viewer: password.viewer(),
        }
    }
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
function standardConfig() {
    return {
        location: {
            secureServerHost: "secure.example.com",
        },
        login: {
            delay: { delay_millisecond: 1 },
        },
        continuousRenew: {
            interval: { interval_millisecond: 1 },
            delay: { delay_millisecond: 1 },
        },
    }
}
function standardRepository(): PasswordLoginTestRepository {
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
function standardSimulator(): PasswordLoginTestRemoteAccess {
    return {
        login: initSubmitPasswordLoginSimulateRemoteAccess(simulateLogin, { wait_millisecond: 0 }),
        renew: renewRemoteAccess(),
    }
}
function waitSimulator(): PasswordLoginTestRemoteAccess {
    return {
        login: initSubmitPasswordLoginSimulateRemoteAccess(simulateLogin, { wait_millisecond: 3 }),
        renew: renewRemoteAccess(),
    }
}

function simulateLogin(_fields: PasswordLoginFields): SubmitLoginRemoteAccessResult {
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
function renewRemoteAccess(): RenewAuthCredentialRemoteAccess {
    let renewed = false
    return initRenewAuthCredentialSimulateRemoteAccess(
        (): RenewAuthCredentialRemoteAccessResult => {
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

function initAsyncTester() {
    return initAsyncComponentStateTester((state: PasswordLoginComponentState) => {
        switch (state.type) {
            case "initial-login":
                return false

            case "try-to-load":
            case "storage-error":
            case "load-error":
            case "error":
                return true

            default:
                return submitEventHasDone(state)
        }
    })
}
