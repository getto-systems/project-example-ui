import {
    initAsyncActionTester_legacy,
    initSyncActionTestRunner,
} from "../../../../../../../z_getto/action/testHelper"
import { WaitTime } from "../../../../../../../z_getto/infra/config/infra"
import { wait } from "../../../../../../../z_getto/infra/delayed/core"
import { checkSessionStatusEventHasDone, initCheckSendingStatusLocationInfo } from "../../impl"
import {
    GetSendingStatusRemote,
    GetSendingStatusResponse,
    GetSendingStatusResult,
    SendTokenRemote,
    SendTokenResult,
} from "../../infra"
import { initGetSendingStatusSimulate } from "../../infra/remote/getSendingStatus/simulate"
import { initSendTokenSimulate } from "../../infra/remote/sendToken/simulate"
import { CheckPasswordResetSendingStatusAction, CheckSendingStatusState } from "./action"
import { initCheckSendingStatusAction, initMaterial, toEntryPoint } from "./impl"

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
        const entryPoint = toEntryPoint(resource)

        const runner = initSyncActionTestRunner()

        runner.addTestCase(
            (check) => {
                entryPoint.terminate()
                resource.ignite()

                // checkStatus の処理が終わるのを待つ
                setTimeout(check, 32)
            },
            (stack) => {
                // no input/validate event after terminate
                expect(stack).toEqual([])
            },
        )

        const handler = runner.run(done)
        resource.subscriber.subscribe(handler)
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
    sendToken: SendTokenRemote
    getStatus: GetSendingStatusRemote
}>

function newTestPasswordResetSessionResource(
    currentURL: URL,
    remote: PasswordResetSessionTestRemoteAccess,
): CheckPasswordResetSendingStatusAction {
    const config = standardConfig()
    return initCheckSendingStatusAction(
        initMaterial(
            {
                ...remote,
                config: config.session.checkStatus,
                wait,
            },
            initCheckSendingStatusLocationInfo(currentURL),
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
        sendToken: initSendTokenSimulate(simulateSendToken, {
            wait_millisecond: 0,
        }),
        getStatus: getStatusRemoteAccess(standardGetStatusResponse(), { wait_millisecond: 0 }),
    }
}
function longSendingSimulator(): PasswordResetSessionTestRemoteAccess {
    return {
        sendToken: initSendTokenSimulate(simulateSendToken, {
            wait_millisecond: 3,
        }),
        getStatus: getStatusRemoteAccess(longSendingGetStatusResponse(), { wait_millisecond: 0 }),
    }
}

function simulateSendToken(): SendTokenResult {
    return { success: true, value: true }
}
function getStatusRemoteAccess(
    responseCollection: GetSendingStatusResponse[],
    interval: WaitTime,
): GetSendingStatusRemote {
    let position = 0
    return initGetSendingStatusSimulate((): GetSendingStatusResult => {
        if (responseCollection.length === 0) {
            return { success: false, err: { type: "infra-error", err: "no response" } }
        }
        const response = getResponse()
        position++

        return { success: true, value: response }
    }, interval)

    function getResponse(): GetSendingStatusResponse {
        if (position < responseCollection.length) {
            return responseCollection[position]
        }
        return responseCollection[responseCollection.length - 1]
    }
}
function standardGetStatusResponse(): GetSendingStatusResponse[] {
    return [{ done: true, send: true }]
}
function longSendingGetStatusResponse(): GetSendingStatusResponse[] {
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
    return initAsyncActionTester_legacy((state: CheckSendingStatusState) => {
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