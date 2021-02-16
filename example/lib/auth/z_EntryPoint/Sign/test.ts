import { initLoginViewLocationInfo, View } from "./impl"

import { newStaticClock } from "../../../z_infra/clock/simulate"
import { initAuthenticatePasswordSimulateRemoteAccess } from "../../sign/password/authenticate/infra/remote/authenticate/simulate"
import { initRenewAuthnInfoSimulateRemoteAccess } from "../../sign/authnInfo/common/infra/remote/renew/simulate"
import { initSubmitPasswordResetResetSimulateRemoteAccess } from "../../sign/password/resetSession/register/infra/remote/submitPasswordResetRegister/simulate"
import { initStartPasswordResetSessionSimulateRemoteAccess } from "../../sign/password/resetSession/start/infra/remote/startPasswordResetSession/simulate"

import { initAuthSignLinkResource } from "./resources/Link/impl"
import { initAuthSignPasswordLoginResource } from "./resources/Password/Login/impl"
import { initPasswordResetSessionResource } from "../../x_Resource/sign/PasswordResetSession/impl"
import { initPasswordResetResource } from "./resources/Password/Reset/Register/impl"

import { initFormAction } from "../../../common/vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../common/field/password/main/password"

import { Clock } from "../../../z_infra/clock/infra"
import { AuthenticatePasswordRemoteAccessResult } from "../../sign/password/authenticate/infra"
import { SubmitPasswordResetRegisterRemoteAccessResult } from "../../sign/password/resetSession/register/infra"

import { AuthSignViewState } from "./entryPoint"

import { markAuthAt, markAuthnNonce } from "../../sign/authnInfo/common/data"
import { markApiNonce, markApiRoles } from "../../../common/apiCredential/data"
import { ApiCredentialRepository } from "../../../common/apiCredential/infra"
import { initMemoryApiCredentialRepository } from "../../../common/apiCredential/infra/repository/memory"
import {
    AuthnInfoRepository,
    RenewAuthnInfoRemoteAccessResult,
} from "../../sign/authnInfo/common/infra"
import { initStartContinuousRenewAuthnInfoAction } from "../../sign/authnInfo/startContinuousRenew/impl"
import { delayed, wait } from "../../../z_infra/delayed/core"
import { initMemoryAuthnInfoRepository } from "../../sign/authnInfo/common/infra/repository/authnInfo/memory"
import {
    initGetSecureScriptPathAction,
    initGetSecureScriptPathActionLocationInfo,
} from "../../sign/secureScriptPath/get/impl"
import {
    initPasswordLoginAction,
    initPasswordLoginActionPod,
} from "../../sign/password/authenticate/impl"
import {
    initPasswordResetRegisterAction,
    initPasswordResetRegisterActionLocationInfo,
    initPasswordResetRegisterActionPod,
} from "../../sign/password/resetSession/register/impl"
import { initPasswordResetSessionActionPod } from "../../sign/password/resetSession/start/impl"
import {
    GetPasswordResetSessionStatusRemoteAccessResult,
    SendPasswordResetSessionTokenRemoteAccessResult,
    StartPasswordResetSessionSessionRemoteAccessResult,
} from "../../sign/password/resetSession/start/infra"
import { markPasswordResetSessionID } from "../../sign/password/resetSession/start/data"
import { initSendPasswordResetSessionTokenSimulateRemoteAccess } from "../../sign/password/resetSession/start/infra/remote/sendPasswordResetSessionToken/simulate"
import { initGetPasswordResetSessionStatusSimulateRemoteAccess } from "../../sign/password/resetSession/start/infra/remote/getPasswordResetSessionStatus/simulate"
import { initRenewAuthnInfoAction } from "../../sign/x_Action/AuthnInfo/Renew/impl"

const AUTHORIZED_AUTHN_NONCE = "authn-nonce" as const
const SUCCEED_TO_LOGIN_AT = new Date("2020-01-01 10:00:00")

const SESSION_ID = "session-id" as const

// renew リクエストを投げるべきかの判定に使用する
// SUCCEED_TO_LOGIN_AT と setContinuousRenew の delay との間でうまく調整する
const NOW = new Date("2020-01-01 10:00:30")

describe("LoginView", () => {
    test("redirect login view", (done) => {
        const { view } = standardLoginView()

        view.addStateHandler(stateHandler())

        view.load()

        function stateHandler(): Handler<AuthSignViewState> {
            const stack: AuthSignViewState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.renew.request()
                        break

                    case "password-login":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-login" })

                        expect(state.entryPoint.resource.href.passwordLogin()).toEqual(
                            "?_password_login"
                        )
                        expect(
                            state.entryPoint.resource.href.passwordResetSession()
                        ).toEqual("?_password_reset=start")

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-reset-session":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("password reset session", (done) => {
        const { view } = passwordResetSessionLoginView()

        view.addStateHandler(stateHandler())

        view.load()

        function stateHandler(): Handler<AuthSignViewState> {
            const stack: AuthSignViewState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.renew.request()
                        break

                    case "password-reset-session":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset-session" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-login":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("password reset", (done) => {
        const { view } = passwordResetLoginView()

        view.addStateHandler(stateHandler())

        view.load()

        function stateHandler(): Handler<AuthSignViewState> {
            const stack: AuthSignViewState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.renew.request()
                        break

                    case "password-reset":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-login":
                    case "password-reset-session":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("error", (done) => {
        const { view } = standardLoginView()

        view.addStateHandler(stateHandler())

        view.error("view error")

        function stateHandler(): Handler<AuthSignViewState> {
            const stack: AuthSignViewState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                    case "password-login":
                    case "password-reset-session":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        expect(stack).toEqual([{ type: "error", err: "view error" }])
                        done()
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })
})

function standardLoginView() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const clock = standardClock()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        link: initAuthSignLinkResource,
        renew: () =>
            standardRenewCredentialResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordLogin: () =>
            standardPasswordLoginResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordReset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}
function passwordResetSessionLoginView() {
    const currentURL = passwordResetSessionURL()
    const repository = standardRepository()
    const clock = standardClock()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        link: initAuthSignLinkResource,
        renew: () =>
            standardRenewCredentialResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordLogin: () =>
            standardPasswordLoginResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordReset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}
function passwordResetLoginView() {
    const currentURL = passwordResetURL()
    const repository = standardRepository()
    const clock = standardClock()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        link: initAuthSignLinkResource,
        renew: () =>
            standardRenewCredentialResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordLogin: () =>
            standardPasswordLoginResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordReset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}

function standardPasswordLoginResource(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authnInfos: AuthnInfoRepository,
    clock: Clock
) {
    return initAuthSignPasswordLoginResource({
        login: {
            continuousRenew: initStartContinuousRenewAuthnInfoAction({
                apiCredentials,
                authnInfos,
                renew: initRenewAuthnInfoSimulateRemoteAccess(simulateRenew, {
                    wait_millisecond: 0,
                }),
                config: {
                    delay: { delay_millisecond: 1 },
                    interval: { interval_millisecond: 1 },
                },
                clock,
            }),
            location: initGetSecureScriptPathAction(
                {
                    config: {
                        secureServerHost: standardSecureHost(),
                    },
                },
                initGetSecureScriptPathActionLocationInfo(currentURL)
            ),
            login: initPasswordLoginAction(
                initPasswordLoginActionPod({
                    login: initAuthenticatePasswordSimulateRemoteAccess(simulateLogin, {
                        wait_millisecond: 0,
                    }),
                    config: {
                        delay: { delay_millisecond: 1 },
                    },
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
function standardPasswordResetResource(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authnInfos: AuthnInfoRepository,
    clock: Clock
) {
    return initPasswordResetResource({
        register: {
            continuousRenew: initStartContinuousRenewAuthnInfoAction({
                apiCredentials,
                authnInfos,
                renew: initRenewAuthnInfoSimulateRemoteAccess(simulateRenew, {
                    wait_millisecond: 0,
                }),
                config: {
                    delay: { delay_millisecond: 1 },
                    interval: { interval_millisecond: 1 },
                },
                clock,
            }),
            location: initGetSecureScriptPathAction(
                {
                    config: {
                        secureServerHost: standardSecureHost(),
                    },
                },
                initGetSecureScriptPathActionLocationInfo(currentURL)
            ),
            register: initPasswordResetRegisterAction(
                initPasswordResetRegisterActionPod({
                    register: initSubmitPasswordResetResetSimulateRemoteAccess(
                        simulateReset,
                        {
                            wait_millisecond: 0,
                        }
                    ),
                    config: {
                        delay: { delay_millisecond: 1 },
                    },
                    delayed,
                }),
                initPasswordResetRegisterActionLocationInfo(currentURL)
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
function standardPasswordResetSessionResource() {
    return initPasswordResetSessionResource(
        {
            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
            },
        },
        {
            initSession: initPasswordResetSessionActionPod({
                start: initStartPasswordResetSessionSimulateRemoteAccess(
                    simulateStartSession,
                    {
                        wait_millisecond: 0,
                    }
                ),
                sendToken: initSendPasswordResetSessionTokenSimulateRemoteAccess(
                    simulateSendToken,
                    {
                        wait_millisecond: 0,
                    }
                ),
                getStatus: initGetPasswordResetSessionStatusSimulateRemoteAccess(
                    simulateGetStatus,
                    {
                        wait_millisecond: 0,
                    }
                ),
                config: {
                    start: {
                        delay: { delay_millisecond: 1 },
                    },
                    checkStatus: {
                        wait: { wait_millisecond: 2 },
                        limit: { limit: 5 },
                    },
                },
                delayed,
                wait,
            }),
        }
    )
}
function standardRenewCredentialResource(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authnInfos: AuthnInfoRepository,
    clock: Clock
) {
    return {
        renew: initRenewAuthnInfoAction(
            {
                renew: {
                    apiCredentials,
                    authnInfos,
                    renew: initRenewAuthnInfoSimulateRemoteAccess(simulateRenew, {
                        wait_millisecond: 0,
                    }),
                    config: {
                        instantLoadExpire: { expire_millisecond: 20 * 1000 },
                        delay: { delay_millisecond: 1 },
                    },
                    delayed,
                    clock,
                },
                startContinuousRenew: {
                    apiCredentials,
                    authnInfos: authnInfos,
                    renew: initRenewAuthnInfoSimulateRemoteAccess(simulateRenew, {
                        wait_millisecond: 0,
                    }),
                    config: {
                        delay: { delay_millisecond: 1 },
                        interval: { interval_millisecond: 1 },
                    },
                    clock,
                },
                getSecureScriptPath: {
                    config: {
                        secureServerHost: standardSecureHost(),
                    },
                },
            },
            initGetSecureScriptPathActionLocationInfo(currentURL)
        ),
    }
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
function passwordResetSessionURL(): URL {
    return new URL("https://example.com/index.html?_password_reset=start")
}
function passwordResetURL(): URL {
    return new URL("https://example.com/index.html?_password_reset=reset")
}

function standardSecureHost(): string {
    return "secure.example.com"
}

function simulateLogin(): AuthenticatePasswordRemoteAccessResult {
    return {
        success: true,
        value: {
            auth: {
                authnNonce: markAuthnNonce(AUTHORIZED_AUTHN_NONCE),
                authAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
            },
            api: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["role"]),
            },
        },
    }
}
function simulateRenew(): RenewAuthnInfoRemoteAccessResult {
    return {
        success: false,
        err: { type: "invalid-ticket" },
    }
}
function simulateReset(): SubmitPasswordResetRegisterRemoteAccessResult {
    return {
        success: true,
        value: {
            auth: {
                authnNonce: markAuthnNonce(AUTHORIZED_AUTHN_NONCE),
                authAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
            },
            api: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["role"]),
            },
        },
    }
}

function simulateStartSession(): StartPasswordResetSessionSessionRemoteAccessResult {
    return { success: true, value: markPasswordResetSessionID(SESSION_ID) }
}
function simulateSendToken(): SendPasswordResetSessionTokenRemoteAccessResult {
    return { success: true, value: true }
}
function simulateGetStatus(): GetPasswordResetSessionStatusRemoteAccessResult {
    return { success: true, value: { dest: { type: "log" }, done: true, send: true } }
}

function standardRepository() {
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

function standardClock(): Clock {
    return newStaticClock(NOW)
}

interface Handler<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
