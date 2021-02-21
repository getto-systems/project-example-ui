import { initStartPasswordResetSessionSimulate } from "../../infra/remote/start/simulate"

import { WaitTime } from "../../../../../../../z_getto/infra/config/infra"
import {
    GetPasswordResetSessionStatusRemote,
    GetPasswordResetSessionStatusResult,
    GetPasswordResetSessionStatusResponse,
    SendPasswordResetSessionTokenRemote,
    SendPasswordResetSessionTokenResult,
    StartPasswordResetSessionSessionRemote,
    StartPasswordResetSessionSessionResult,
} from "../../infra"

import { StartPasswordResetSessionCoreState } from "./Core/action"

import { markPasswordResetSessionID } from "../../data"
import {
    checkPasswordResetSessionStatusEventHasDone,
    startPasswordResetSessionEventHasDone,
} from "../../impl"
import { delayed, wait } from "../../../../../../../z_getto/infra/delayed/core"
import { initAsyncActionTester_legacy } from "../../../../../../../z_getto/application/testHelper"
import { initSendPasswordResetSessionTokenSimulate } from "../../infra/remote/sendToken/simulate"
import { initGetPasswordResetSessionStatusSimulate } from "../../infra/remote/getStatus/simulate"
import { initStartPasswordResetSessionFormAction } from "./Form/impl"
import { initStartPasswordResetSessionCoreAction } from "./Core/impl"
import { StartPasswordResetSessionAction } from "./action"
import { newBoardValidateStack } from "../../../../../../../z_getto/board/kernel/infra/stack"
import { standardBoardValueStore } from "../../../../../../../z_getto/board/input/x_Action/Input/testHelper"
import { markBoardValue } from "../../../../../../../z_getto/board/kernel/data"

const VALID_LOGIN = { loginID: "login-id" } as const
const SESSION_ID = "session-id" as const

describe("PasswordResetSession", () => {
    test("submit valid login-id", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.core.addStateHandler(initTester())

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-start-session" },
                    { type: "try-to-check-status" },
                    { type: "succeed-to-send-token", dest: { type: "log" } },
                ])
                done()
            })
        }
    })

    test("submit valid login-id; with delayed", (done) => {
        // wait for delayed timeout
        const { resource } = waitPasswordResetSessionResource()

        resource.core.addStateHandler(initTester())

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-start-session" },
                    { type: "delayed-to-start-session" }, // delayed event
                    { type: "try-to-check-status" },
                    { type: "succeed-to-send-token", dest: { type: "log" } },
                ])
                done()
            })
        }
    })

    test("submit valid login-id; with long sending", (done) => {
        // wait for send token check limit
        const { resource } = longSendingPasswordResetSessionResource()

        resource.core.addStateHandler(initTester())

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-start-session" },
                    { type: "try-to-check-status" },
                    {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: true },
                    },
                    {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: true },
                    },
                    {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: true },
                    },
                    {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: true },
                    },
                    {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: true },
                    },
                    {
                        type: "failed-to-check-status",
                        err: { type: "infra-error", err: "overflow check limit" },
                    },
                ])
                done()
            })
        }
    })

    test("submit without fields", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.core.addStateHandler(initTester())

        // try to start session without fields
        //resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "failed-to-start-session", err: { type: "validation-error" } },
                ])
                done()
            })
        }
    })

    test("clear", () => {
        const { resource } = standardPasswordResetSessionResource()

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.clear()

        expect(resource.form.loginID.input.get()).toEqual("")
    })
})

function standardPasswordResetSessionResource() {
    const simulator = standardRemoteAccess()
    const resource = newTestPasswordResetSessionResource(simulator)

    return { resource }
}
function waitPasswordResetSessionResource() {
    const simulator = waitRemoteAccess()
    const resource = newTestPasswordResetSessionResource(simulator)

    return { resource }
}
function longSendingPasswordResetSessionResource() {
    const simulator = longSendingSimulator()
    const resource = newTestPasswordResetSessionResource(simulator)

    return { resource }
}

type PasswordResetSessionTestRemoteAccess = Readonly<{
    start: StartPasswordResetSessionSessionRemote
    sendToken: SendPasswordResetSessionTokenRemote
    getStatus: GetPasswordResetSessionStatusRemote
}>

function newTestPasswordResetSessionResource(
    remote: PasswordResetSessionTestRemoteAccess,
): StartPasswordResetSessionAction {
    const config = standardConfig()
    const action = {
        core: initStartPasswordResetSessionCoreAction({
            start: {
                ...remote,
                config: config.session.start,
                delayed,
            },
            checkStatus: {
                ...remote,
                config: config.session.checkStatus,
                wait,
            },
        }),

        form: initStartPasswordResetSessionFormAction({
            stack: newBoardValidateStack(),
        }),
    }

    action.form.loginID.input.linkStore(standardBoardValueStore())

    return action
}

function standardConfig() {
    return {
        session: {
            start: {
                delay: { delay_millisecond: 1 },
            },
            checkStatus: {
                wait: { wait_millisecond: 2 },
                limit: { limit: 5 },
            },
        },
    }
}
function standardRemoteAccess(): PasswordResetSessionTestRemoteAccess {
    return {
        start: initStartPasswordResetSessionSimulate(simulateStartSession, {
            wait_millisecond: 0,
        }),
        sendToken: initSendPasswordResetSessionTokenSimulate(simulateSendToken, {
            wait_millisecond: 0,
        }),
        getStatus: getStatusRemoteAccess(standardGetStatusResponse(), { wait_millisecond: 0 }),
    }
}
function waitRemoteAccess(): PasswordResetSessionTestRemoteAccess {
    return {
        start: initStartPasswordResetSessionSimulate(simulateStartSession, {
            wait_millisecond: 3,
        }),
        sendToken: initSendPasswordResetSessionTokenSimulate(simulateSendToken, {
            wait_millisecond: 0,
        }),
        getStatus: getStatusRemoteAccess(standardGetStatusResponse(), { wait_millisecond: 0 }),
    }
}
function longSendingSimulator(): PasswordResetSessionTestRemoteAccess {
    return {
        start: initStartPasswordResetSessionSimulate(simulateStartSession, {
            wait_millisecond: 0,
        }),
        sendToken: initSendPasswordResetSessionTokenSimulate(simulateSendToken, {
            wait_millisecond: 3,
        }),
        getStatus: getStatusRemoteAccess(longSendingGetStatusResponse(), { wait_millisecond: 0 }),
    }
}

function simulateStartSession(): StartPasswordResetSessionSessionResult {
    return { success: true, value: markPasswordResetSessionID(SESSION_ID) }
}
function simulateSendToken(): SendPasswordResetSessionTokenResult {
    return { success: true, value: true }
}
function getStatusRemoteAccess(
    responseCollection: GetPasswordResetSessionStatusResponse[],
    interval: WaitTime,
): GetPasswordResetSessionStatusRemote {
    let position = 0
    return initGetPasswordResetSessionStatusSimulate((): GetPasswordResetSessionStatusResult => {
        if (responseCollection.length === 0) {
            return { success: false, err: { type: "infra-error", err: "no response" } }
        }
        const response = getResponse()
        position++

        return { success: true, value: response }
    }, interval)

    function getResponse(): GetPasswordResetSessionStatusResponse {
        if (position < responseCollection.length) {
            return responseCollection[position]
        }
        return responseCollection[responseCollection.length - 1]
    }
}
function standardGetStatusResponse(): GetPasswordResetSessionStatusResponse[] {
    return [{ dest: { type: "log" }, done: true, send: true }]
}
function longSendingGetStatusResponse(): GetPasswordResetSessionStatusResponse[] {
    // 完了するまでに 5回以上かかる
    return [
        { dest: { type: "log" }, done: false, status: { sending: true } },
        { dest: { type: "log" }, done: false, status: { sending: true } },
        { dest: { type: "log" }, done: false, status: { sending: true } },
        { dest: { type: "log" }, done: false, status: { sending: true } },
        { dest: { type: "log" }, done: false, status: { sending: true } },
        { dest: { type: "log" }, done: false, status: { sending: true } },
    ]
}

function initAsyncTester() {
    return initAsyncActionTester_legacy((state: StartPasswordResetSessionCoreState) => {
        switch (state.type) {
            case "initial-reset-session":
                return false

            case "try-to-start-session":
            case "delayed-to-start-session":
            case "failed-to-start-session":
                return startPasswordResetSessionEventHasDone(state)

            case "try-to-check-status":
            case "retry-to-check-status":
            case "failed-to-check-status":
            case "failed-to-send-token":
            case "succeed-to-send-token":
                return checkPasswordResetSessionStatusEventHasDone(state)
        }
    })
}
