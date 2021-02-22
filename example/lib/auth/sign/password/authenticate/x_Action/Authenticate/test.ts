import { initStaticClock, StaticClock } from "../../../../../../z_getto/infra/clock/simulate"
import { initAuthenticatePasswordSimulate } from "../../infra/remote/authenticate/simulate"
import { initRenewAuthnInfoSimulate } from "../../../../kernel/authnInfo/kernel/infra/remote/renew/simulate"

import { AuthenticatePasswordRemote, AuthenticatePasswordResult } from "../../infra"
import { Clock } from "../../../../../../z_getto/infra/clock/infra"

import { AuthenticatePasswordAction } from "./action"

import { AuthenticatePasswordCoreState } from "./Core/action"

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
import { newGetSecureScriptPathLocationInfo } from "../../../../common/secureScriptPath/get/impl"
import { delayed, wait } from "../../../../../../z_getto/infra/delayed/core"
import { authenticatePasswordEventHasDone } from "../../impl"
import { initAsyncActionTestRunner } from "../../../../../../z_getto/application/testHelper"
import { initAuthenticatePasswordFormAction } from "./Form/impl"
import { initAuthenticatePasswordCoreAction } from "./Core/impl"
import { markBoardValue } from "../../../../../../z_getto/board/kernel/data"
import { newBoardValidateStack } from "../../../../../../z_getto/board/kernel/infra/stack"
import { standardBoardValueStore } from "../../../../../../z_getto/board/input/x_Action/Input/testHelper"

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

        const checker = initAsyncRunner()

        checker.addTestCase(
            () => {
                resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))
                resource.form.password.input.set(markBoardValue(VALID_LOGIN.password))

                resource.core.submit(resource.form.validate.get())
            },
            (stack) => {
                clock.update(COMPLETED_NOW)
                expect(stack).toEqual([
                    { type: "try-to-login" },
                    {
                        type: "try-to-load",
                        scriptPath: markSecureScriptPath("https://secure.example.com/index.js"),
                    },
                ])
                expectToSaveLastAuth(repository.authnInfos)
            },
        )
        checker.addTestCase(
            (check) => {
                // after setContinuousRenew interval and delay
                wait({ wait_millisecond: 1 }, check)
            },
            () => {
                expectToSaveRenewed(repository.authnInfos)
            },
        )

        resource.core.addStateHandler(checker.run(done))
    })

    test("submit valid login-id and password; with delayed", (done) => {
        // wait for delayed timeout
        const { repository, clock, resource } = waitPasswordLoginResource()

        const checker = initAsyncRunner()

        checker.addTestCase(
            () => {
                resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))
                resource.form.password.input.set(markBoardValue(VALID_LOGIN.password))

                resource.core.submit(resource.form.validate.get())
            },
            (stack) => {
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
            },
        )
        checker.addTestCase(
            (check) => {
                // after setContinuousRenew interval and delay
                wait({ wait_millisecond: 1 }, check)
            },
            () => {
                expectToSaveRenewed(repository.authnInfos)
            },
        )

        resource.core.addStateHandler(checker.run(done))
    })

    test("submit without fields", (done) => {
        const { repository, resource } = standardPasswordLoginResource()

        const checker = initAsyncRunner()

        checker.addTestCase(
            () => {
                // try to login without fields
                // resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
                // resource.form.password.input.input(markInputString(VALID_LOGIN.password))

                resource.core.submit(resource.form.validate.get())
            },
            (stack) => {
                expect(stack).toEqual([
                    { type: "failed-to-login", err: { type: "validation-error" } },
                ])
                expectToEmptyLastAuth(repository.authnInfos)
            },
        )

        resource.core.addStateHandler(checker.run(done))
    })

    test("clear", () => {
        const { resource } = standardPasswordLoginResource()

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.input.set(markBoardValue(VALID_LOGIN.password))
        resource.form.clear()

        expect(resource.form.loginID.input.get()).toEqual("")
        expect(resource.form.password.input.get()).toEqual("")
    })

    test("load error", (done) => {
        const { resource } = standardPasswordLoginResource()

        const checker = initAsyncRunner()

        checker.addTestCase(
            () => {
                resource.core.loadError({ type: "infra-error", err: "load error" })
            },
            (stack) => {
                expect(stack).toEqual([
                    {
                        type: "load-error",
                        err: { type: "infra-error", err: "load error" },
                    },
                ])
            },
        )

        resource.core.addStateHandler(checker.run(done))
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
    clock: Clock,
): AuthenticatePasswordAction {
    const config = standardConfig()
    const action = {
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
            newGetSecureScriptPathLocationInfo(currentURL),
        ),

        form: initAuthenticatePasswordFormAction({
            stack: newBoardValidateStack(),
        }),
    }

    action.form.loginID.input.linkStore(standardBoardValueStore())
    action.form.password.input.linkStore(standardBoardValueStore())

    return action
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

function initAsyncRunner() {
    return initAsyncActionTestRunner((state: AuthenticatePasswordCoreState) => {
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
