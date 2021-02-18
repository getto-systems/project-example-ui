import { newStaticClock, StaticClock } from "../../../../../../z_infra/clock/simulate"
import { initAuthenticatePasswordSimulate } from "../../infra/remote/authenticate/simulate"
import { initRenewAuthnInfoSimulate } from "../../../../kernel/authnInfo/kernel/infra/remote/renew/simulate"

import { initFormAction } from "../../../../../../common/vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../../common/field/password/main/password"

import {
    AuthenticatePasswordRemote,
    AuthenticatePasswordResult,
} from "../../infra"
import { Clock } from "../../../../../../z_infra/clock/infra"

import { AuthenticatePasswordResource } from "./action"

import { AuthenticatePasswordCoreState } from "./Core/action"

import {
    markInputString,
    toValidationError,
} from "../../../../../../common/vendor/getto-form/form/data"
import { markSecureScriptPath } from "../../../../common/secureScriptPath/get/data"
import { AuthenticatePasswordFields } from "../../data"
import { markAuthAt, markAuthnNonce } from "../../../../kernel/authnInfo/kernel/data"
import { ApiCredentialRepository } from "../../../../../../common/apiCredential/infra"
import { initMemoryApiCredentialRepository } from "../../../../../../common/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../../../../common/apiCredential/data"
import {
    AuthnInfoRepository,
    RenewAuthnInfoRemote,
    RenewAuthnInfoResult,
} from "../../../../kernel/authnInfo/kernel/infra"
import { initMemoryAuthnInfoRepository } from "../../../../kernel/authnInfo/kernel/infra/repository/authnInfo/memory"
import { initGetSecureScriptPathLocationInfo } from "../../../../common/secureScriptPath/get/impl"
import { delayed } from "../../../../../../z_infra/delayed/core"
import { authenticatePasswordEventHasDone } from "../../impl"
import {
    initAsyncActionTester,
    initSyncActionChecker,
} from "../../../../../../common/vendor/getto-example/Application/testHelper"
import { initAuthenticatePasswordFormAction } from "./Form/impl"
import { initAuthenticatePasswordCoreAction } from "./Core/impl"

const VALID_LOGIN = { loginID: "login-id", password: "password" } as const

const AUTHORIZED_AUTHN_NONCE = "authn-nonce" as const
const SUCCEED_TO_AUTH_AT = new Date("2020-01-01 10:00:00")

const RENEWED_AUTHN_NONCE = "renewed-authn-nonce" as const
const SUCCEED_TO_RENEW_AT = new Date("2020-01-01 10:01:00")

// renew リクエストを投げるべきかの判定に使用する
// SUCCEED_TO_AUTH_AT と setContinuousRenew の delay との間でうまく調整する
const NOW = new Date("2020-01-01 10:00:30")

// continuous renew リクエストを投げるべきかの判定に使用する
// テストが完了したら clock が返す値をこっちにする
const COMPLETED_NOW = new Date("2020-01-01 11:00:00")

describe("PasswordAuthenticate", () => {
    test("submit valid login-id and password", (done) => {
        const { repository, clock, resource } = standardPasswordLoginResource()

        resource.core.addStateHandler(initTester())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        resource.form.loginID.input.change()

        resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        resource.form.password.input.change()

        resource.core.submit(resource.form.getLoginFields())

        function initTester() {
            return initAsyncTester()((stack) => {
                clock.update(COMPLETED_NOW)
                expect(stack).toEqual([
                    { type: "try-to-login" },
                    {
                        type: "try-to-load",
                        scriptPath: markSecureScriptPath("https://secure.example.com/index.js"),
                    },
                ])
                expectToSaveLastAuth(repository.authnInfos)
                setTimeout(() => {
                    expectToSaveRenewed(repository.authnInfos)
                    done()
                }, 1) // after setContinuousRenew interval and delay
            })
        }
    })

    test("submit valid login-id and password; with delayed", (done) => {
        // wait for delayed timeout
        const { repository, clock, resource } = waitPasswordLoginResource()

        resource.core.addStateHandler(initTester())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        resource.form.loginID.input.change()

        resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        resource.form.password.input.change()

        resource.core.submit(resource.form.getLoginFields())

        function initTester() {
            return initAsyncTester()((stack) => {
                clock.update(COMPLETED_NOW)
                expect(stack).toEqual([
                    { type: "try-to-login" },
                    { type: "delayed-to-login" }, // delayed event
                    {
                        type: "try-to-load",
                        scriptPath: markSecureScriptPath("https://secure.example.com/index.js"),
                    },
                ])
                expectToSaveLastAuth(repository.authnInfos)
                setTimeout(() => {
                    expectToSaveRenewed(repository.authnInfos)
                    done()
                }, 1) // after setContinuousRenew interval and delay
            })
        }
    })

    test("submit without fields", (done) => {
        const { repository, resource } = standardPasswordLoginResource()

        resource.core.addStateHandler(initTester())

        // try to login without fields
        // resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        // resource.form.loginID.input.change()

        // resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        // resource.form.password.input.change()

        resource.core.submit(resource.form.getLoginFields())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "failed-to-login", err: { type: "validation-error" } },
                ])
                expectToEmptyLastAuth(repository.authnInfos)
                done()
            })
        }
    })

    test("load error", (done) => {
        const { resource } = standardPasswordLoginResource()

        resource.core.addStateHandler(initTester())

        resource.core.loadError({ type: "infra-error", err: "load error" })

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "load-error",
                        err: { type: "infra-error", err: "load error" },
                    },
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
                return initSyncActionChecker((stack) => {
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
                return initSyncActionChecker((stack) => {
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
                return initSyncActionChecker((stack) => {
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
                    main: initSyncActionChecker(() => {
                        expect(result).toEqual({ loginID: true, password: true })
                        done()
                    }),
                    loginID: initSyncActionChecker((stack) => {
                        expect(stack).toEqual([
                            { value: "loginID-a" },
                            { value: "loginID-b" },
                            { value: "loginID-a" },
                            { value: "loginID-c" },
                        ])
                        result.loginID = true
                    }),
                    password: initSyncActionChecker((stack) => {
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
                return initSyncActionChecker((stack) => {
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
                return initSyncActionChecker((stack) => {
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
                    return initSyncActionChecker((stack) => {
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
                    return initSyncActionChecker((stack) => {
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
                    return initSyncActionChecker((stack) => {
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
                    return initSyncActionChecker((stack) => {
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
                    return initSyncActionChecker((stack) => {
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
                    return initSyncActionChecker((stack) => {
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
                    return initSyncActionChecker((stack) => {
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
    const resource = newTestPasswordLoginResource(
        currentURL,
        repository,
        simulator,
        clock
    )

    return { repository, clock, resource }
}
function waitPasswordLoginResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = waitSimulator()
    const clock = standardClock()
    const resource = newTestPasswordLoginResource(
        currentURL,
        repository,
        simulator,
        clock
    )

    return { repository, clock, resource }
}

type PasswordLoginTestRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
}>
type PasswordLoginTestRemoteAccess = Readonly<{
    login: AuthenticatePasswordRemote
    renew: RenewAuthnInfoRemote
}>

function newTestPasswordLoginResource(
    currentURL: URL,
    repository: PasswordLoginTestRepository,
    remote: PasswordLoginTestRemoteAccess,
    clock: Clock
): AuthenticatePasswordResource {
    const config = standardConfig()
    return {
        core: initAuthenticatePasswordCoreAction(
            {
                startContinuousRenew: {
                    ...repository,
                    ...remote,
                    config: config.continuousRenew,
                    clock,
                },
                getSecureScriptPath: {
                    config: config.location,
                },
                authenticate: {
                    ...remote,
                    config: config.login,
                    delayed,
                },
            },
            initGetSecureScriptPathLocationInfo(currentURL)
        ),

        form: initAuthenticatePasswordFormAction(formMaterial()),
    }

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
            value: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["role"]),
            },
        }),
        authnInfos: initMemoryAuthnInfoRepository({
            authnNonce: { set: false },
            lastAuthAt: { set: false },
        }),
    }
}
function standardSimulator(): PasswordLoginTestRemoteAccess {
    return {
        login: initAuthenticatePasswordSimulate(simulateLogin, {
            wait_millisecond: 0,
        }),
        renew: renewRemoteAccess(),
    }
}
function waitSimulator(): PasswordLoginTestRemoteAccess {
    return {
        login: initAuthenticatePasswordSimulate(simulateLogin, {
            wait_millisecond: 3,
        }),
        renew: renewRemoteAccess(),
    }
}

function simulateLogin(_fields: AuthenticatePasswordFields): AuthenticatePasswordResult {
    return {
        success: true,
        value: {
            auth: {
                authnNonce: markAuthnNonce(AUTHORIZED_AUTHN_NONCE),
                authAt: markAuthAt(SUCCEED_TO_AUTH_AT),
            },
            api: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["role"]),
            },
        },
    }
}
function renewRemoteAccess(): RenewAuthnInfoRemote {
    let renewed = false
    return initRenewAuthnInfoSimulate(
        (): RenewAuthnInfoResult => {
            if (renewed) {
                // 最初の一回だけ renew して、あとは renew を cancel するために null を返す
                return { success: false, err: { type: "invalid-ticket" } }
            }
            renewed = true

            return {
                success: true,
                value: {
                    auth: {
                        authnNonce: markAuthnNonce(RENEWED_AUTHN_NONCE),
                        authAt: markAuthAt(SUCCEED_TO_RENEW_AT),
                    },
                    api: {
                        apiNonce: markApiNonce("api-nonce"),
                        apiRoles: markApiRoles(["role"]),
                    },
                },
            }
        },
        { wait_millisecond: 0 }
    )
}

function standardClock(): StaticClock {
    return newStaticClock(NOW)
}

function expectToSaveLastAuth(authnInfos: AuthnInfoRepository) {
    expect(authnInfos.load()).toEqual({
        success: true,
        found: true,
        lastAuth: {
            authnNonce: markAuthnNonce(AUTHORIZED_AUTHN_NONCE),
            lastAuthAt: markAuthAt(SUCCEED_TO_AUTH_AT),
        },
    })
}
function expectToSaveRenewed(authnInfos: AuthnInfoRepository) {
    expect(authnInfos.load()).toEqual({
        success: true,
        found: true,
        lastAuth: {
            authnNonce: markAuthnNonce(RENEWED_AUTHN_NONCE),
            lastAuthAt: markAuthAt(SUCCEED_TO_RENEW_AT),
        },
    })
}
function expectToEmptyLastAuth(authnInfos: AuthnInfoRepository) {
    expect(authnInfos.load()).toEqual({
        success: true,
        found: false,
    })
}

function initAsyncTester() {
    return initAsyncActionTester((state: AuthenticatePasswordCoreState) => {
        switch (state.type) {
            case "initial-login":
                return false

            case "try-to-load":
            case "storage-error":
            case "load-error":
                return true

            default:
                return authenticatePasswordEventHasDone(state)
        }
    })
}