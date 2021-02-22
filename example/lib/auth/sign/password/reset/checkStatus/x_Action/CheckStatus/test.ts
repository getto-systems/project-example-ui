import { initAsyncActionTester_legacy } from "../../../../../../../z_getto/application/testHelper"
import { WaitTime } from "../../../../../../../z_getto/infra/config/infra"
import { wait } from "../../../../../../../z_getto/infra/delayed/core"
import {
    checkPasswordResetSessionStatusEventHasDone,
    newCheckPasswordResetSendingStatusLocationInfo,
} from "../../impl"
import {
    GetPasswordResetSendingStatusRemote,
    GetPasswordResetSendingStatusResponse,
    GetPasswordResetSendingStatusResult,
    SendPasswordResetTokenRemote,
    SendPasswordResetTokenResult,
} from "../../infra"
import { initGetPasswordResetSendingStatusSimulate } from "../../infra/remote/getStatus/simulate"
import { initSendPasswordResetTokenSimulate } from "../../infra/remote/sendToken/simulate"
import {
    CheckPasswordResetSendingStatusAction,
    CheckPasswordResetSendingStatusState,
} from "./action"
import { initCheckPasswordResetSendingStatusAction } from "./impl"

describe("CheckPasswordResetSendingStatus", () => {
    test("valid session-id", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.addStateHandler(initTester())

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

        resource.addStateHandler(initTester())

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

        resource.addStateHandler(initTester())

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
    sendToken: SendPasswordResetTokenRemote
    getStatus: GetPasswordResetSendingStatusRemote
}>

function newTestPasswordResetSessionResource(
    currentURL: URL,
    remote: PasswordResetSessionTestRemoteAccess,
): CheckPasswordResetSendingStatusAction {
    const config = standardConfig()
    return initCheckPasswordResetSendingStatusAction(
        {
            checkStatus: {
                ...remote,
                config: config.session.checkStatus,
                wait,
            },
        },
        newCheckPasswordResetSendingStatusLocationInfo(currentURL),
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
        sendToken: initSendPasswordResetTokenSimulate(simulateSendToken, {
            wait_millisecond: 0,
        }),
        getStatus: getStatusRemoteAccess(standardGetStatusResponse(), { wait_millisecond: 0 }),
    }
}
function longSendingSimulator(): PasswordResetSessionTestRemoteAccess {
    return {
        sendToken: initSendPasswordResetTokenSimulate(simulateSendToken, {
            wait_millisecond: 3,
        }),
        getStatus: getStatusRemoteAccess(longSendingGetStatusResponse(), { wait_millisecond: 0 }),
    }
}

function simulateSendToken(): SendPasswordResetTokenResult {
    return { success: true, value: true }
}
function getStatusRemoteAccess(
    responseCollection: GetPasswordResetSendingStatusResponse[],
    interval: WaitTime,
): GetPasswordResetSendingStatusRemote {
    let position = 0
    return initGetPasswordResetSendingStatusSimulate((): GetPasswordResetSendingStatusResult => {
        if (responseCollection.length === 0) {
            return { success: false, err: { type: "infra-error", err: "no response" } }
        }
        const response = getResponse()
        position++

        return { success: true, value: response }
    }, interval)

    function getResponse(): GetPasswordResetSendingStatusResponse {
        if (position < responseCollection.length) {
            return responseCollection[position]
        }
        return responseCollection[responseCollection.length - 1]
    }
}
function standardGetStatusResponse(): GetPasswordResetSendingStatusResponse[] {
    return [{ done: true, send: true }]
}
function longSendingGetStatusResponse(): GetPasswordResetSendingStatusResponse[] {
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
    return initAsyncActionTester_legacy((state: CheckPasswordResetSendingStatusState) => {
        switch (state.type) {
            case "initial-check-status":
                return false

            case "try-to-check-status":
            case "retry-to-check-status":
            case "failed-to-check-status":
            case "failed-to-send-token":
            case "succeed-to-send-token":
                return checkPasswordResetSessionStatusEventHasDone(state)
        }
    })
}
