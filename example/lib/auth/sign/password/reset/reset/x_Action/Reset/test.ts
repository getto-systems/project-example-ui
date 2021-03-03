import {
    ClockPubSub,
    ClockSubscriber,
    initStaticClock,
    staticClockPubSub,
} from "../../../../../../../z_vendor/getto-application/infra/clock/simulate"

import { Clock } from "../../../../../../../z_vendor/getto-application/infra/clock/infra"
import { ResetRemotePod, ResetResult } from "../../infra"

import { ResetPasswordAction } from "./action"

import { CoreState } from "./Core/action"

import { markSecureScriptPath } from "../../../../../common/secureScriptPath/get/data"
import {
    LastAuthRepositoryPod,
    LastAuthRepositoryValue,
    RenewRemotePod,
} from "../../../../../kernel/authInfo/kernel/infra"
import { newGetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/impl"
import { initResetLocationInfo, resetEventHasDone } from "../../impl"
import {
    initAsyncActionTester_legacy,
    initSyncActionTestRunner,
} from "../../../../../../../z_vendor/getto-application/action/testHelper"
import { markBoardValue } from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { initFormAction } from "./Form/impl"
import { standardBoardValueStore } from "../../../../../../../z_vendor/getto-application/board/input/Action/testHelper"
import { toAction, toEntryPoint } from "./impl"
import { initCoreAction, initCoreMaterial } from "./Core/impl"
import { AuthzRepositoryPod, AuthzRepositoryValue } from "../../../../../../../common/authz/infra"
import { initMemoryDB } from "../../../../../../../z_vendor/getto-application/infra/repository/memory"
import { wrapRepository } from "../../../../../../../z_vendor/getto-application/infra/repository/helper"
import { lastAuthRepositoryConverter } from "../../../../../kernel/authInfo/kernel/convert"
import { initRemoteSimulator } from "../../../../../../../z_vendor/getto-application/infra/remote/simulate"

const VALID_LOGIN = { loginID: "login-id", password: "password" } as const

const AUTHORIZED_AUTHN_NONCE = "authn-nonce" as const

const RENEWED_AUTHN_NONCE = "renewed-authn-nonce" as const
const SUCCEED_TO_RENEW_AT = [
    new Date("2020-01-01 10:01:00"),
    new Date("2020-01-01 10:01:01"),
    new Date("2020-01-01 11:00:00"),
]

const FINISHED = new Date("2020-01-01 11:00:00")

// renew リクエストを投げるべきかの判定に使用する
// SUCCEED_TO_AUTH_AT と setContinuousRenew の delay との間でうまく調整する
const NOW = new Date("2020-01-01 10:00:30")

// continuous renew リクエストを投げるべきかの判定に使用する
// テストが完了したら clock が返す値をこっちにする
const COMPLETED_NOW = new Date("2020-01-01 11:00:00")

describe("RegisterPassword", () => {
    test("submit valid login-id and password", (done) => {
        const { repository, clock, resource } = standardPasswordResetResource()
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        resource.core.subscriber.subscribe(initTester())

        resource.form.loginID.resource.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.resource.input.set(markBoardValue(VALID_LOGIN.password))

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
                expect(lastAuth.get()).toEqual({
                    success: true,
                    found: true,
                    value: {
                        nonce: AUTHORIZED_AUTHN_NONCE,
                        lastAuthAt: NOW,
                    },
                })
                setTimeout(() => {
                    expect(lastAuth.get()).toEqual({
                        success: true,
                        found: true,
                        value: {
                            nonce: RENEWED_AUTHN_NONCE,
                            lastAuthAt: SUCCEED_TO_RENEW_AT[0],
                        },
                    })
                    done()
                }, 1) // after setContinuousRenew interval and delay
            })
        }
    })

    test("submit valid login-id and password; with delayed", (done) => {
        // wait for delayed timeout
        const { repository, clock, resource } = waitPasswordResetResource()
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        resource.core.subscriber.subscribe(initTester())

        resource.form.loginID.resource.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.resource.input.set(markBoardValue(VALID_LOGIN.password))

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
                expect(lastAuth.get()).toEqual({
                    success: true,
                    found: true,
                    value: {
                        nonce: AUTHORIZED_AUTHN_NONCE,
                        lastAuthAt: NOW,
                    },
                })
                setTimeout(() => {
                    expect(lastAuth.get()).toEqual({
                        success: true,
                        found: true,
                        value: {
                            nonce: RENEWED_AUTHN_NONCE,
                            lastAuthAt: SUCCEED_TO_RENEW_AT[0],
                        },
                    })
                    done()
                }, 1) // after setContinuousRenew interval and delay
            })
        }
    })

    test("submit without fields", (done) => {
        const { repository, resource } = standardPasswordResetResource()
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        resource.core.subscriber.subscribe(initTester())

        // try to reset without fields

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "failed-to-reset", err: { type: "validation-error" } },
                ])
                expect(lastAuth.get()).toEqual({
                    success: true,
                    found: false,
                })
                done()
            })
        }
    })

    test("submit without resetToken", (done) => {
        const { repository, resource } = emptyResetTokenPasswordResetResource()
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        resource.core.subscriber.subscribe(initTester())

        resource.form.loginID.resource.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.resource.input.set(markBoardValue(VALID_LOGIN.password))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "failed-to-reset", err: { type: "empty-reset-token" } },
                ])
                expect(lastAuth.get()).toEqual({
                    success: true,
                    found: false,
                })
                done()
            })
        }
    })

    test("clear", () => {
        const { resource } = standardPasswordResetResource()

        resource.form.loginID.resource.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.resource.input.set(markBoardValue(VALID_LOGIN.password))
        resource.form.clear()

        expect(resource.form.loginID.resource.input.get()).toEqual("")
        expect(resource.form.password.resource.input.get()).toEqual("")
    })

    test("load error", (done) => {
        const { resource } = standardPasswordResetResource()

        resource.core.subscriber.subscribe(initTester())

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
        const entryPoint = toEntryPoint(resource)

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    entryPoint.terminate()
                    resource.form.loginID.resource.input.set(markBoardValue("login-id"))
                    resource.form.password.resource.input.set(markBoardValue("password"))
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        const handler = runner(done)
        resource.core.subscriber.subscribe(handler)
        resource.form.validate.subscriber.subscribe(handler)
        resource.form.loginID.validate.subscriber.subscribe(handler)
        resource.form.password.validate.subscriber.subscribe(handler)
        resource.form.loginID.resource.input.subscribeInputEvent(() => handler("input"))
        resource.form.password.resource.input.subscribeInputEvent(() => handler("input"))
    })
})

function standardPasswordResetResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const clockPubSub = staticClockPubSub()
    const simulator = standardRemoteAccess(clockPubSub)
    const clock = standardClock(clockPubSub)
    const resource = newPasswordResetTestResource(currentURL, repository, simulator, clock)

    return { repository, clock: clockPubSub, resource }
}
function waitPasswordResetResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const clockPubSub = staticClockPubSub()
    const simulator = waitRemoteAccess(clockPubSub)
    const clock = standardClock(clockPubSub)
    const resource = newPasswordResetTestResource(currentURL, repository, simulator, clock)

    return { repository, clock: clockPubSub, resource }
}
function emptyResetTokenPasswordResetResource() {
    const currentURL = emptyResetTokenURL()
    const repository = standardRepository()
    const clockPubSub = staticClockPubSub()
    const simulator = standardRemoteAccess(clockPubSub)
    const clock = standardClock(clockPubSub)
    const resource = newPasswordResetTestResource(currentURL, repository, simulator, clock)

    return { repository, resource }
}

type PasswordResetTestRepository = Readonly<{
    authz: AuthzRepositoryPod
    lastAuth: LastAuthRepositoryPod
}>
type PasswordResetTestRemoteAccess = Readonly<{
    reset: ResetRemotePod
    renew: RenewRemotePod
}>

function newPasswordResetTestResource(
    currentURL: URL,
    repository: PasswordResetTestRepository,
    remote: PasswordResetTestRemoteAccess,
    clock: Clock,
): ResetPasswordAction {
    const config = standardConfig()
    const action = toAction({
        core: initCoreAction(
            initCoreMaterial(
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
                        clock,
                    },
                },
                {
                    ...newGetSecureScriptPathLocationInfo(currentURL),
                    ...initResetLocationInfo(currentURL),
                },
            ),
        ),

        form: initFormAction(),
    })

    action.form.loginID.resource.input.storeLinker.link(standardBoardValueStore())
    action.form.password.resource.input.storeLinker.link(standardBoardValueStore())

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
    const authz = initMemoryDB<AuthzRepositoryValue>()
    authz.set({
        nonce: "api-nonce",
        roles: ["role"],
    })

    const lastAuth = initMemoryDB<LastAuthRepositoryValue>()

    return {
        authz: <AuthzRepositoryPod>wrapRepository(authz),
        lastAuth: <LastAuthRepositoryPod>wrapRepository(lastAuth),
    }
}
function standardRemoteAccess(clock: ClockPubSub): PasswordResetTestRemoteAccess {
    return {
        reset: initRemoteSimulator(simulateReset, {
            wait_millisecond: 0,
        }),
        renew: renewRemoteAccess(clock),
    }
}
function waitRemoteAccess(clock: ClockPubSub): PasswordResetTestRemoteAccess {
    return {
        reset: initRemoteSimulator(simulateReset, {
            wait_millisecond: 3,
        }),
        renew: renewRemoteAccess(clock),
    }
}

function simulateReset(): ResetResult {
    return {
        success: true,
        value: {
            authn: {
                nonce: AUTHORIZED_AUTHN_NONCE,
            },
            authz: {
                nonce: "api-nonce",
                roles: ["role"],
            },
        },
    }
}
function renewRemoteAccess(clock: ClockPubSub): RenewRemotePod {
    let renewed = false
    return initRemoteSimulator(
        () => {
            if (renewed) {
                // 最初の一回だけ renew して、あとは renew を cancel するために null を返す
                clock.update(FINISHED)
                return { success: false, err: { type: "invalid-ticket" } }
            }
            renewed = true

            // 現在時刻を動かす
            const now = SUCCEED_TO_RENEW_AT[0]
            const nextNow = SUCCEED_TO_RENEW_AT[1]
            clock.update(now)
            setTimeout(() => clock.update(nextNow))

            return {
                success: true,
                value: {
                    authn: {
                        nonce: RENEWED_AUTHN_NONCE,
                    },
                    authz: {
                        nonce: "api-nonce",
                        roles: ["role"],
                    },
                },
            }
        },
        { wait_millisecond: 0 },
    )
}

function standardClock(subscriber: ClockSubscriber): Clock {
    return initStaticClock(NOW, subscriber)
}

function initAsyncTester() {
    return initAsyncActionTester_legacy((state: CoreState) => {
        switch (state.type) {
            case "initial-reset":
                return false

            case "try-to-load":
            case "repository-error":
            case "load-error":
                return true

            default:
                return resetEventHasDone(state)
        }
    })
}
