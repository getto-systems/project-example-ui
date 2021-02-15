import { initStartPasswordResetSessionSimulateRemoteAccess } from "../../../sign/password/reset/session/infra/remote/startPasswordResetSession/simulate"

import { WaitTime } from "../../../../z_infra/time/infra"
import {
    GetPasswordResetSessionStatusRemoteAccess,
    GetPasswordResetSessionStatusRemoteAccessResult,
    GetPasswordResetSessionStatusResponse,
    SendPasswordResetSessionTokenRemoteAccess,
    SendPasswordResetSessionTokenRemoteAccessResult,
    StartPasswordResetSessionSessionRemoteAccess,
    StartPasswordResetSessionSessionRemoteAccessResult,
} from "../../../sign/password/reset/session/infra"

import { StartComponentState } from "./Start/component"

import { markPasswordResetSessionID } from "../../../sign/password/reset/session/data"
import { markInputString, toValidationError } from "../../../../vendor/getto-form/form/data"
import { PasswordResetSessionResource } from "./resource"
import { initPasswordResetSessionResource } from "./impl"
import { initFormAction } from "../../../../vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../common/field/loginID/main/loginID"
import {
    checkPasswordResetSessionStatusEventHasDone,
    initPasswordResetSessionActionPod,
    startPasswordResetSessionEventHasDone,
} from "../../../sign/password/reset/session/impl"
import { delayed, wait } from "../../../../z_infra/delayed/core"
import {
    initAsyncComponentStateTester,
    initSyncComponentTestChecker,
} from "../../../../vendor/getto-example/Application/testHelper"
import { initSendPasswordResetSessionTokenSimulateRemoteAccess } from "../../../sign/password/reset/session/infra/remote/sendPasswordResetSessionToken/simulate"
import { initGetPasswordResetSessionStatusSimulateRemoteAccess } from "../../../sign/password/reset/session/infra/remote/getPasswordResetSessionStatus/simulate"

const VALID_LOGIN = { loginID: "login-id" } as const
const SESSION_ID = "session-id" as const

describe("PasswordResetSession", () => {
    test("submit valid login-id", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.start.addStateHandler(initTester())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.start.submit(resource.form.getStartSessionFields())

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

        resource.start.addStateHandler(initTester())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.start.submit(resource.form.getStartSessionFields())

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

        resource.start.addStateHandler(initTester())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.start.submit(resource.form.getStartSessionFields())

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

        resource.start.addStateHandler(initTester())

        // try to start session without fields
        //resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.start.submit(resource.form.getStartSessionFields())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "failed-to-start-session", err: { type: "validation-error" } },
                ])
                done()
            })
        }
    })

    describe("form", () => {
        test("initial without input field", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            expect(resource.form.getStartSessionFields()).toEqual({ success: false })

            checker.done()

            function initChecker() {
                return initSyncComponentTestChecker((stack) => {
                    expect(stack).toEqual([
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
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
            resource.form.loginID.input.change()

            expect(resource.form.getStartSessionFields()).toEqual({
                success: true,
                value: {
                    loginID: VALID_LOGIN.loginID,
                },
            })

            checker.done()

            function initChecker() {
                return initSyncComponentTestChecker((stack) => {
                    expect(stack).toEqual([
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
                    ])
                    done()
                })
            }
        })

        test("invalid with input invalid field", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString(""))
            resource.form.loginID.input.change()

            expect(resource.form.getStartSessionFields()).toEqual({ success: false })

            checker.done()

            function initChecker() {
                return initSyncComponentTestChecker((stack) => {
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

        test("undo / redo", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)

            resource.form.undo()

            resource.form.loginID.input.input(markInputString("loginID-a"))
            resource.form.loginID.input.change()

            resource.form.undo()
            resource.form.redo()

            resource.form.loginID.input.input(markInputString("loginID-b"))
            resource.form.loginID.input.change()

            resource.form.undo()

            resource.form.loginID.input.input(markInputString("loginID-c"))
            resource.form.loginID.input.change()

            resource.form.redo()

            checker.done()

            function initChecker() {
                return initSyncComponentTestChecker((stack) => {
                    expect(stack).toEqual([
                        { value: "loginID-a" },
                        { value: "" },
                        { value: "loginID-a" },
                        { value: "loginID-b" },
                        { value: "loginID-a" },
                        { value: "loginID-c" },
                    ])
                    done()
                })
            }
        })

        test("removeStateHandler", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)
            resource.form.loginID.input.removeStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString("loginID-a"))

            checker.done()

            function initChecker() {
                return initSyncComponentTestChecker((stack) => {
                    expect(stack).toEqual([])
                    done()
                })
            }
        })

        test("terminate", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)

            resource.form.terminate()

            resource.form.loginID.input.input(markInputString("loginID-a"))

            checker.done()

            function initChecker() {
                return initSyncComponentTestChecker((stack) => {
                    expect(stack).toEqual([])
                    done()
                })
            }
        })
    })

    describe("fields", () => {
        describe("loginID", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordResetSessionResource()

                const checker = initChecker()
                resource.form.loginID.addStateHandler(checker.handler)

                resource.form.loginID.input.input(markInputString(""))

                checker.done()

                function initChecker() {
                    return initSyncComponentTestChecker((stack) => {
                        expect(stack).toEqual([{ result: toValidationError(["empty"]) }])
                        done()
                    })
                }
            })
        })
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
    start: StartPasswordResetSessionSessionRemoteAccess
    sendToken: SendPasswordResetSessionTokenRemoteAccess
    getStatus: GetPasswordResetSessionStatusRemoteAccess
}>

function newTestPasswordResetSessionResource(
    remote: PasswordResetSessionTestRemoteAccess
): PasswordResetSessionResource {
    const config = standardConfig()
    return initPasswordResetSessionResource(
        {
            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
            },
        },
        {
            initSession: initPasswordResetSessionActionPod({
                ...remote,
                config: config.session,
                delayed,
                wait,
            }),
        }
    )
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
        start: initStartPasswordResetSessionSimulateRemoteAccess(simulateStartSession, {
            wait_millisecond: 0,
        }),
        sendToken: initSendPasswordResetSessionTokenSimulateRemoteAccess(simulateSendToken, {
            wait_millisecond: 0,
        }),
        getStatus: getStatusRemoteAccess(standardGetStatusResponse(), { wait_millisecond: 0 }),
    }
}
function waitRemoteAccess(): PasswordResetSessionTestRemoteAccess {
    return {
        start: initStartPasswordResetSessionSimulateRemoteAccess(simulateStartSession, {
            wait_millisecond: 3,
        }),
        sendToken: initSendPasswordResetSessionTokenSimulateRemoteAccess(simulateSendToken, {
            wait_millisecond: 0,
        }),
        getStatus: getStatusRemoteAccess(standardGetStatusResponse(), { wait_millisecond: 0 }),
    }
}
function longSendingSimulator(): PasswordResetSessionTestRemoteAccess {
    return {
        start: initStartPasswordResetSessionSimulateRemoteAccess(simulateStartSession, {
            wait_millisecond: 0,
        }),
        sendToken: initSendPasswordResetSessionTokenSimulateRemoteAccess(simulateSendToken, {
            wait_millisecond: 3,
        }),
        getStatus: getStatusRemoteAccess(longSendingGetStatusResponse(), { wait_millisecond: 0 }),
    }
}

function simulateStartSession(): StartPasswordResetSessionSessionRemoteAccessResult {
    return { success: true, value: markPasswordResetSessionID(SESSION_ID) }
}
function simulateSendToken(): SendPasswordResetSessionTokenRemoteAccessResult {
    return { success: true, value: true }
}
function getStatusRemoteAccess(
    responseCollection: GetPasswordResetSessionStatusResponse[],
    interval: WaitTime
): GetPasswordResetSessionStatusRemoteAccess {
    let position = 0
    return initGetPasswordResetSessionStatusSimulateRemoteAccess(
        (): GetPasswordResetSessionStatusRemoteAccessResult => {
            if (responseCollection.length === 0) {
                return { success: false, err: { type: "infra-error", err: "no response" } }
            }
            const response = getResponse()
            position++

            return { success: true, value: response }
        },
        interval
    )

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
    return initAsyncComponentStateTester((state: StartComponentState) => {
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

            case "error":
                return true
        }
    })
}
