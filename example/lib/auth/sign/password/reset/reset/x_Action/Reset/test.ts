import { initStaticClock, StaticClock } from "../../../../../../../z_getto/infra/clock/simulate"
import { initRenewAuthnInfoSimulate } from "../../../../../kernel/authnInfo/kernel/infra/remote/renew/simulate"
import { initResetPasswordSimulate } from "../../infra/remote/reset/simulate"

import { Clock } from "../../../../../../../z_getto/infra/clock/infra"
import { ResetPasswordRemote, ResetPasswordResult } from "../../infra"

import { ResetPasswordAction } from "./action"

import { ResetPasswordCoreState } from "./Core/action"

import { markSecureScriptPath } from "../../../../../common/secureScriptPath/get/data"
import { markAuthAt, markAuthnNonce } from "../../../../../kernel/authnInfo/kernel/data"
import { initMemoryApiCredentialRepository } from "../../../../../../../common/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../../../../../common/apiCredential/data"
import { ApiCredentialRepository } from "../../../../../../../common/apiCredential/infra"
import {
    AuthnInfoRepository,
    RenewAuthnInfoRemote,
    RenewAuthnInfoResult,
} from "../../../../../kernel/authnInfo/kernel/infra"
import { initMemoryAuthnInfoRepository } from "../../../../../kernel/authnInfo/kernel/infra/repository/authnInfo/memory"
import { newGetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/impl"
import { newResetPasswordLocationInfo, resetPasswordEventHasDone } from "../../impl"
import { delayed } from "../../../../../../../z_getto/infra/delayed/core"
import {
    initAsyncActionTester_legacy,
    initSyncActionTestRunner,
} from "../../../../../../../z_getto/application/testHelper"
import { initResetPasswordCoreAction } from "./Core/impl"
import { markBoardValue } from "../../../../../../../z_getto/board/kernel/data"
import { newBoardValidateStack } from "../../../../../../../z_getto/board/kernel/infra/stack"
import { initResetPasswordFormAction } from "./Form/impl"
import { standardBoardValueStore } from "../../../../../../../z_getto/board/input/x_Action/Input/testHelper"
import { toResetPasswordAction } from "./impl"

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

describe("RegisterPassword", () => {
    test("submit valid login-id and password", (done) => {
        const { repository, clock, resource } = standardPasswordResetResource()

        const ignition = resource.core.ignition()
        ignition.subscribe(initTester())

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.input.set(markBoardValue(VALID_LOGIN.password))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                clock.update(COMPLETED_NOW)
                expect(stack).toEqual([
                    { type: "try-to-reset" },
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
        const { repository, clock, resource } = waitPasswordResetResource()

        const ignition = resource.core.ignition()
        ignition.subscribe(initTester())

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.input.set(markBoardValue(VALID_LOGIN.password))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                clock.update(COMPLETED_NOW)
                expect(stack).toEqual([
                    { type: "try-to-reset" },
                    { type: "delayed-to-reset" }, // delayed event
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
        const { repository, resource } = standardPasswordResetResource()

        const ignition = resource.core.ignition()
        ignition.subscribe(initTester())

        // try to reset without fields

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "failed-to-reset", err: { type: "validation-error" } },
                ])
                expectToEmptyLastAuth(repository.authnInfos)
                done()
            })
        }
    })

    test("submit without resetToken", (done) => {
        const { repository, resource } = emptyResetTokenPasswordResetResource()

        const ignition = resource.core.ignition()
        ignition.subscribe(initTester())

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.input.set(markBoardValue(VALID_LOGIN.password))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "failed-to-reset", err: { type: "empty-reset-token" } },
                ])
                expectToEmptyLastAuth(repository.authnInfos)
                done()
            })
        }
    })

    test("clear", () => {
        const { resource } = standardPasswordResetResource()

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.input.set(markBoardValue(VALID_LOGIN.password))
        resource.form.clear()

        expect(resource.form.loginID.input.get()).toEqual("")
        expect(resource.form.password.input.get()).toEqual("")
    })

    test("load error", (done) => {
        const { resource } = standardPasswordResetResource()

        const ignition = resource.core.ignition()
        ignition.subscribe(initTester())

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

    test("terminate", (done) => {
        const { resource } = standardPasswordResetResource()

        const ignition = {
            core: resource.core.ignition(),
            form: resource.form.validate.ignition(),
            loginID: resource.form.loginID.validate.ignition(),
            password: resource.form.password.validate.ignition(),
        }

        const runner = initSyncActionTestRunner()

        runner.addTestCase(
            () => {
                resource.terminate()
                resource.form.loginID.input.set(markBoardValue("login-id"))
                resource.form.password.input.set(markBoardValue("password"))
            },
            (stack) => {
                // no input/validate event after terminate
                expect(stack).toEqual([])
            },
        )

        const handler = runner.run(done)
        ignition.core.subscribe(handler)
        ignition.form.subscribe(handler)
        ignition.loginID.subscribe(handler)
        ignition.password.subscribe(handler)
        resource.form.loginID.input.addInputHandler(() => handler("input"))
        resource.form.password.input.addInputHandler(() => handler("input"))
    })
})

function standardPasswordResetResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = standardRemoteAccess()
    const clock = standardClock()
    const resource = newPasswordResetTestResource(currentURL, repository, simulator, clock)

    return { repository, clock, resource }
}
function waitPasswordResetResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = waitRemoteAccess()
    const clock = standardClock()
    const resource = newPasswordResetTestResource(currentURL, repository, simulator, clock)

    return { repository, clock, resource }
}
function emptyResetTokenPasswordResetResource() {
    const currentURL = emptyResetTokenURL()
    const repository = standardRepository()
    const simulator = standardRemoteAccess()
    const clock = standardClock()
    const resource = newPasswordResetTestResource(currentURL, repository, simulator, clock)

    return { repository, resource }
}

type PasswordResetTestRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
}>
type PasswordResetTestRemoteAccess = Readonly<{
    reset: ResetPasswordRemote
    renew: RenewAuthnInfoRemote
}>

function newPasswordResetTestResource(
    currentURL: URL,
    repository: PasswordResetTestRepository,
    remote: PasswordResetTestRemoteAccess,
    clock: Clock,
): ResetPasswordAction {
    const config = standardConfig()
    const action = toResetPasswordAction({
        core: initResetPasswordCoreAction(
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
                reset: {
                    ...remote,
                    config: config.reset,
                    delayed,
                },
            },
            {
                ...newGetSecureScriptPathLocationInfo(currentURL),
                ...newResetPasswordLocationInfo(currentURL),
            },
        ),

        form: initResetPasswordFormAction({
            stack: newBoardValidateStack(),
        }),
    })

    action.form.loginID.input.linkStore(standardBoardValueStore())
    action.form.password.input.linkStore(standardBoardValueStore())

    return action
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
        reset: {
            delay: { delay_millisecond: 1 },
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
function standardRemoteAccess(): PasswordResetTestRemoteAccess {
    return {
        reset: initResetPasswordSimulate(simulateReset, {
            wait_millisecond: 0,
        }),
        renew: renewRemoteAccess(),
    }
}
function waitRemoteAccess(): PasswordResetTestRemoteAccess {
    return {
        reset: initResetPasswordSimulate(simulateReset, {
            wait_millisecond: 3,
        }),
        renew: renewRemoteAccess(),
    }
}

function simulateReset(): ResetPasswordResult {
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
        { wait_millisecond: 0 },
    )
}

function standardClock(): StaticClock {
    return initStaticClock(NOW)
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
    return initAsyncActionTester_legacy((state: ResetPasswordCoreState) => {
        switch (state.type) {
            case "initial-reset":
                return false

            case "try-to-load":
            case "storage-error":
            case "load-error":
                return true

            default:
                return resetPasswordEventHasDone(state)
        }
    })
}
