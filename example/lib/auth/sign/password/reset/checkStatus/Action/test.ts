import {
    initAsyncActionTester_legacy,
    initSyncActionTestRunner,
} from "../../../../../../z_vendor/getto-application/action/testHelper"
import { WaitTime } from "../../../../../../z_vendor/getto-application/infra/config/infra"
import { initRemoteSimulator } from "../../../../../../z_vendor/getto-application/infra/remote/simulate"
import { initLocationDetecter } from "../../../../../../z_vendor/getto-application/location/testHelper"
import { signLinkParams } from "../../../../common/link/data"
import { ResetTokenSendingResult } from "../data"
import { checkSessionStatusEventHasDone, detectSessionID } from "../impl/core"
import {
    GetResetTokenSendingStatusRemotePod,
    GetResetTokenSendingStatusResult,
    SendResetTokenRemotePod,
    SendResetTokenResult,
} from "../infra"
import {
    CheckResetTokenSendingStatusCoreAction,
    CheckResetTokenSendingStatusCoreState,
} from "./Core/action"
import {
    initCheckResetTokenSendingStatusCoreAction,
    initCheckResetTokenSendingStatusCoreMaterial,
} from "./Core/impl"
import { toCheckResetTokenSendingStatusEntryPoint } from "./impl"

describe("CheckPasswordResetSendingStatus", () => {
    test("valid session-id", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.subscriber.subscribe(initTester())

        resource.ignite()

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-check-status" },
                    { type: "succeed-to-send-token" },
                ])
                done()
            })
        }
    })

    test("submit valid login-id; with long sending", (done) => {
        // wait for send token check limit
        const { resource } = longSendingPasswordResetSessionResource()

        resource.subscriber.subscribe(initTester())

        resource.ignite()

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-check-status" },
                    { type: "retry-to-check-status", status: { sending: true } },
                    { type: "retry-to-check-status", status: { sending: true } },
                    { type: "retry-to-check-status", status: { sending: true } },
                    { type: "retry-to-check-status", status: { sending: true } },
                    { type: "retry-to-check-status", status: { sending: true } },
                    {
                        type: "failed-to-check-status",
                        err: { type: "infra-error", err: "overflow check limit" },
                    },
                ])
                done()
            })
        }
    })

    test("check without session id", (done) => {
        const { resource } = noSessionIDPasswordResetSessionResource()

        resource.subscriber.subscribe(initTester())

        resource.ignite()

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "failed-to-check-status", err: { type: "empty-session-id" } },
                ])
                done()
            })
        }
    })

    test("terminate", (done) => {
        const { resource } = standardPasswordResetSessionResource()
        const entryPoint = toCheckResetTokenSendingStatusEntryPoint(resource)

        const runner = initSyncActionTestRunner([
            {
                statement: (check) => {
                    entryPoint.terminate()
                    resource.ignite()

                    // checkStatus の処理が終わるのを待つ
                    setTimeout(check, 32)
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        resource.subscriber.subscribe(runner(done))
    })
})

function standardPasswordResetSessionResource() {
    const currentURL = standardURL()
    const simulator = standardRemoteAccess()
    const resource = newTestPasswordResetSessionResource(currentURL, simulator)

    return { resource }
}
function longSendingPasswordResetSessionResource() {
    const currentURL = standardURL()
    const simulator = longSendingSimulator()
    const resource = newTestPasswordResetSessionResource(currentURL, simulator)

    return { resource }
}
function noSessionIDPasswordResetSessionResource() {
    3
    const currentURL = noSessionID_URL()
    const simulator = standardRemoteAccess()
    const resource = newTestPasswordResetSessionResource(currentURL, simulator)

    return { resource }
}

function standardURL() {
    return new URL(
        "https://example.com/index.html?_password_reset=checkStatus&_password_reset_session_id=session-id",
    )
}
function noSessionID_URL() {
    return new URL("https://example.com/index.html?_password_reset=checkStatus")
}

type PasswordResetSessionTestRemoteAccess = Readonly<{
    sendToken: SendResetTokenRemotePod
    getStatus: GetResetTokenSendingStatusRemotePod
}>

function newTestPasswordResetSessionResource(
    currentURL: URL,
    remote: PasswordResetSessionTestRemoteAccess,
): CheckResetTokenSendingStatusCoreAction {
    const config = standardConfig()
    return initCheckResetTokenSendingStatusCoreAction(
        initCheckResetTokenSendingStatusCoreMaterial(
            {
                ...remote,
                config: config.session.checkStatus,
            },
            initLocationDetecter(currentURL, detectSessionID(signLinkParams.password.reset)),
        ),
    )
}

function standardConfig() {
    return {
        session: {
            checkStatus: {
                wait: { wait_millisecond: 2 },
                limit: { limit: 5 },
            },
        },
    }
}
function standardRemoteAccess(): PasswordResetSessionTestRemoteAccess {
    return {
        sendToken: initRemoteSimulator(simulateSendToken, { wait_millisecond: 0 }),
        getStatus: getStatusRemoteAccess(standardGetStatusResponse(), { wait_millisecond: 0 }),
    }
}
function longSendingSimulator(): PasswordResetSessionTestRemoteAccess {
    return {
        sendToken: initRemoteSimulator(simulateSendToken, { wait_millisecond: 3 }),
        getStatus: getStatusRemoteAccess(longSendingGetStatusResponse(), { wait_millisecond: 0 }),
    }
}

function simulateSendToken(): SendResetTokenResult {
    return { success: true, value: true }
}
function getStatusRemoteAccess(
    responseCollection: ResetTokenSendingResult[],
    interval: WaitTime,
): GetResetTokenSendingStatusRemotePod {
    let position = 0
    return initRemoteSimulator((): GetResetTokenSendingStatusResult => {
        if (responseCollection.length === 0) {
            return { success: false, err: { type: "infra-error", err: "no response" } }
        }
        const response = getResponse()
        position++

        return { success: true, value: response }
    }, interval)

    function getResponse(): ResetTokenSendingResult {
        if (position < responseCollection.length) {
            return responseCollection[position]
        }
        return responseCollection[responseCollection.length - 1]
    }
}
function standardGetStatusResponse(): ResetTokenSendingResult[] {
    return [{ done: true, send: true }]
}
function longSendingGetStatusResponse(): ResetTokenSendingResult[] {
    // 完了するまでに 5回以上かかる
    return [
        { done: false, status: { sending: true } },
        { done: false, status: { sending: true } },
        { done: false, status: { sending: true } },
        { done: false, status: { sending: true } },
        { done: false, status: { sending: true } },
        { done: false, status: { sending: true } },
    ]
}

function initAsyncTester() {
    return initAsyncActionTester_legacy((state: CheckResetTokenSendingStatusCoreState) => {
        switch (state.type) {
            case "initial-check-status":
                return false

            case "try-to-check-status":
            case "retry-to-check-status":
            case "failed-to-check-status":
            case "failed-to-send-token":
            case "succeed-to-send-token":
                return checkSessionStatusEventHasDone(state)
        }
    })
}
