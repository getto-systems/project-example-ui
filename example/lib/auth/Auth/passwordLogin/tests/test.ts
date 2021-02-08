import { initAuthCredentialTestStorage } from "../../Login/tests/core"
import {
    PasswordLoginConfig,
    newPasswordLoginResource,
    PasswordLoginRepository,
    PasswordLoginSimulator,
} from "./core"

import { wait } from "../../../../z_infra/delayed/core"
import { initStaticClock, StaticClock } from "../../../../z_infra/clock/simulate"
import { RenewSimulator } from "../../../login/renew/impl/remote/renew/simulate"

import { initAuthCredentialRepository } from "../../../login/renew/impl/repository/authCredential"

import { AuthCredentialRepository } from "../../../login/renew/infra"

import { FormInputState, FormState } from "../../../../sub/getto-form/component/component"
import { LoginIDFormFieldState } from "../../field/loginID/component"
import { PasswordFormFieldState } from "../../field/password/component"
import { PasswordLoginState } from "../component"

import { markScriptPath } from "../../../common/application/data"
import {
    AuthCredential,
    markApiCredential,
    markAuthAt,
    markTicketNonce,
} from "../../../common/credential/data"
import { LoginFields } from "../../../login/passwordLogin/data"
import { markInputString, toValidationError } from "../../../../sub/getto-form/action/data"

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

        resource.passwordLogin.addStateHandler(stateHandler())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        resource.form.loginID.input.change()

        resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        resource.form.password.input.change()

        resource.passwordLogin.login(resource.form.getLoginFields())

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
                        clock.update(COMPLETED_NOW)
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

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("submit valid login-id and password; with delayed", (done) => {
        // wait for delayed timeout
        const { repository, clock, resource } = waitPasswordLoginResource()

        resource.passwordLogin.addStateHandler(stateHandler())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        resource.form.loginID.input.change()

        resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        resource.form.password.input.change()

        resource.passwordLogin.login(resource.form.getLoginFields())

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
                        clock.update(COMPLETED_NOW)
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

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("submit without fields", (done) => {
        const { repository, resource } = standardPasswordLoginResource()

        resource.passwordLogin.addStateHandler(stateHandler())

        // try to login without fields
        // resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
        // resource.form.loginID.input.change()

        // resource.form.password.input.input(markInputString(VALID_LOGIN.password))
        // resource.form.password.input.change()

        resource.passwordLogin.login(resource.form.getLoginFields())

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

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("load error", (done) => {
        const { resource } = standardPasswordLoginResource()

        resource.passwordLogin.addStateHandler(stateHandler())

        resource.passwordLogin.loadError({ type: "infra-error", err: "load error" })

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

    describe("form", () => {
        test("initial without input field", (done) => {
            const { resource } = standardPasswordLoginResource()

            resource.form.addStateHandler(stateHandler())

            expect(resource.form.getLoginFields()).toMatchObject({ success: false })

            function stateHandler(): Post<FormState> {
                const stack: FormState[] = []
                return (state) => {
                    stack.push(state)

                    if (stack.length === 2) {
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
                    }
                }
            }
        })

        test("valid with input valid field", (done) => {
            const { resource } = standardPasswordLoginResource()

            resource.form.addStateHandler(stateHandler())

            resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
            resource.form.loginID.input.change()

            resource.form.password.input.input(markInputString(VALID_LOGIN.password))
            resource.form.password.input.change()

            expect(resource.form.getLoginFields()).toMatchObject({
                success: true,
                value: {
                    loginID: VALID_LOGIN.loginID,
                    password: VALID_LOGIN.password,
                },
            })

            function stateHandler(): Post<FormState> {
                const stack: FormState[] = []
                return (state) => {
                    stack.push(state)

                    if (stack.length === 6) {
                        expect(stack).toEqual([
                            {
                                validation: "initial",
                                history: { undo: false, redo: false },
                            },
                            {
                                validation: "initial",
                                history: { undo: false, redo: false },
                            },
                            {
                                validation: "valid",
                                history: { undo: false, redo: false },
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
                    }
                }
            }
        })

        test("invalid with input invalid field", (done) => {
            const { resource } = standardPasswordLoginResource()

            resource.form.addStateHandler(stateHandler())

            resource.form.loginID.input.input(markInputString(""))
            resource.form.loginID.input.change()

            resource.form.password.input.input(markInputString(""))
            resource.form.password.input.change()

            expect(resource.form.getLoginFields()).toMatchObject({ success: false })

            function stateHandler(): Post<FormState> {
                const stack: FormState[] = []
                return (state) => {
                    stack.push(state)

                    if (stack.length === 4) {
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
                    }
                }
            }
        })

        test("undo / redo", (done) => {
            const { resource } = standardPasswordLoginResource()

            const handler = {
                loginID: stateHandler(examineLoginIDStack),
                password: stateHandler(examinePasswordStack),
            }
            resource.form.loginID.input.addStateHandler(handler.loginID.handler)
            resource.form.password.input.addStateHandler(handler.password.handler)

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

            handler.loginID.test()
            handler.password.test()
            done()

            function stateHandler(examine: { (stack: FormInputState[]): void }) {
                const stack: FormInputState[] = []

                return {
                    handler: (state: FormInputState) => {
                        stack.push(state)
                    },
                    test: () => {
                        examine(stack)
                    },
                }
            }
            function examineLoginIDStack(stack: FormInputState[]): void {
                expect(stack).toEqual([
                    { value: "loginID-a" },
                    { value: "loginID-b" },
                    { value: "loginID-a" },
                    { value: "loginID-c" },
                ])
            }
            function examinePasswordStack(stack: FormInputState[]): void {
                expect(stack).toEqual([
                    { value: "password-a" },
                    { value: "" },
                    { value: "password-a" },
                    { value: "password-b" },
                ])
            }
        })
    })

    describe("fields", () => {
        describe("loginID", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.form.loginID.addStateHandler(stateHandler())

                resource.form.loginID.input.input(markInputString(""))

                function stateHandler(): Post<LoginIDFormFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            result: toValidationError(["empty"]),
                        })
                        done()
                    }
                }
            })
        })

        describe("password", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.form.password.addStateHandler(stateHandler())

                resource.form.password.input.input(markInputString(""))

                function stateHandler(): Post<PasswordFormFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            result: toValidationError(["empty"]),
                            character: { complex: false },
                            view: { show: false },
                        })
                        done()
                    }
                }
            })

            test("invalid with too long string", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.form.password.addStateHandler(stateHandler())

                resource.form.password.input.input(markInputString("a".repeat(73)))

                function stateHandler(): Post<PasswordFormFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            result: toValidationError(["too-long"]),
                            character: { complex: false },
                            view: { show: false },
                        })
                        done()
                    }
                }
            })

            test("invalid with too long string including multi-byte character", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.form.password.addStateHandler(stateHandler())

                // "あ"(UTF8) is 3 bytes character
                resource.form.password.input.input(markInputString("あ".repeat(24) + "a"))

                function stateHandler(): Post<PasswordFormFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            result: toValidationError(["too-long"]),
                            character: { complex: true },
                            view: { show: false },
                        })
                        done()
                    }
                }
            })

            test("valid with just 72 byte string", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.form.password.addStateHandler(stateHandler())

                resource.form.password.input.input(markInputString("a".repeat(72)))

                function stateHandler(): Post<PasswordFormFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            result: { valid: true },
                            character: { complex: false },
                            view: { show: false },
                        })
                        done()
                    }
                }
            })

            test("valid with just 72 byte string including multi-byte character", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.form.password.addStateHandler(stateHandler())

                // "あ"(UTF8) is 3 bytes character
                resource.form.password.input.input(markInputString("あ".repeat(24)))

                function stateHandler(): Post<PasswordFormFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            result: { valid: true },
                            character: { complex: true },
                            view: { show: false },
                        })
                        done()
                    }
                }
            })

            test("show/hide password", (done) => {
                const { resource } = standardPasswordLoginResource()

                resource.form.password.addStateHandler(stateHandler())

                resource.form.password.input.input(markInputString("password"))
                resource.form.password.show()
                resource.form.password.hide()

                function stateHandler(): Post<PasswordFormFieldState> {
                    const stack: PasswordFormFieldState[] = []
                    return (state) => {
                        stack.push(state)

                        if (stack.length === 3) {
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
                        }
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
    const clock = standardClock()
    const resource = newPasswordLoginResource(currentURL, config, repository, simulator, clock)

    return { repository, clock, resource }
}
function waitPasswordLoginResource() {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = standardRepository()
    const simulator = waitSimulator()
    const clock = standardClock()
    const resource = newPasswordLoginResource(currentURL, config, repository, simulator, clock)

    return { repository, clock, resource }
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
function standardConfig(): PasswordLoginConfig {
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
function standardRepository(): PasswordLoginRepository {
    return {
        authCredentials: initAuthCredentialRepository(
            initAuthCredentialTestStorage({
                ticketNonce: { set: false },
                apiCredential: { set: false },
                lastAuthAt: { set: false },
            })
        ),
    }
}
function standardSimulator(): PasswordLoginSimulator {
    return {
        login: {
            login: async (fields) => {
                return simulateLogin(fields)
            },
        },
        renew: renewSimulator(),
    }
}
function waitSimulator(): PasswordLoginSimulator {
    return {
        login: {
            login: async (fields) => {
                // wait for delayed timeout
                await wait({ wait_millisecond: 3 }, () => null)
                return simulateLogin(fields)
            },
        },
        renew: renewSimulator(),
    }
}

function simulateLogin(_fields: LoginFields): AuthCredential {
    return {
        ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
        apiCredential: markApiCredential({ apiRoles: ["role"] }),
        authAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
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
                authAt: markAuthAt(SUCCEED_TO_RENEW_AT),
            }
        },
    }
}

function standardClock(): StaticClock {
    return initStaticClock(NOW)
}

function expectToSaveLastLogin(authCredentials: AuthCredentialRepository) {
    expect(authCredentials.findLastLogin()).toEqual({
        success: true,
        found: true,
        lastLogin: {
            ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
            lastAuthAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
        },
    })
}
function expectToSaveRenewed(authCredentials: AuthCredentialRepository) {
    expect(authCredentials.findLastLogin()).toEqual({
        success: true,
        found: true,
        lastLogin: {
            ticketNonce: markTicketNonce(RENEWED_TICKET_NONCE),
            lastAuthAt: markAuthAt(SUCCEED_TO_RENEW_AT),
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
