import { wait } from "../../../../z_external/delayed"

import {
    PasswordResetSessionConfig,
    newPasswordResetSessionResource,
    PasswordResetSessionSimulator,
} from "./core"

import { SendTokenState } from "../../../profile/password_reset/impl/client/session/simulate"

import { PasswordResetSessionState } from "../component"
import { LoginIDFieldState } from "../../field/login_id/component"

import { hasError, markInputValue } from "../../../common/field/data"
import {
    Destination,
    markSessionID,
    SessionID,
    StartSessionFields,
} from "../../../profile/password_reset/data"

const VALID_LOGIN = { loginID: "login-id" } as const
const SESSION_ID = "session-id" as const

describe("PasswordResetSession", () => {
    test("submit valid login-id", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.passwordResetSession.onStateChange(stateHandler())

        resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))

        resource.passwordResetSession.startSession()

        function stateHandler(): Post<PasswordResetSessionState> {
            const stack: PasswordResetSessionState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-reset-session":
                    case "try-to-start-session":
                    case "delayed-to-start-session":
                    case "try-to-check-status":
                    case "retry-to-check-status":
                        // work in progress...
                        break

                    case "succeed-to-send-token":
                        expect(stack).toEqual([
                            { type: "try-to-start-session" },
                            { type: "try-to-check-status" },
                            {
                                type: "retry-to-check-status",
                                dest: { type: "log" },
                                status: { sending: false },
                            },
                            {
                                type: "retry-to-check-status",
                                dest: { type: "log" },
                                status: { sending: true },
                            },
                            { type: "succeed-to-send-token", dest: { type: "log" } },
                        ])
                        done()
                        break

                    case "failed-to-start-session":
                    case "failed-to-check-status":
                    case "failed-to-send-token":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("submit valid login-id; with delayed", (done) => {
        // wait for delayed timeout
        const { resource } = waitPasswordResetSessionResource()

        resource.passwordResetSession.onStateChange(stateHandler())

        resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))

        resource.passwordResetSession.startSession()

        function stateHandler(): Post<PasswordResetSessionState> {
            const stack: PasswordResetSessionState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-reset-session":
                    case "try-to-start-session":
                    case "delayed-to-start-session":
                    case "try-to-check-status":
                    case "retry-to-check-status":
                        // work in progress...
                        break

                    case "succeed-to-send-token":
                        expect(stack).toEqual([
                            { type: "try-to-start-session" },
                            { type: "delayed-to-start-session" }, // delayed event
                            { type: "try-to-check-status" },
                            {
                                type: "retry-to-check-status",
                                dest: { type: "log" },
                                status: { sending: false },
                            },
                            {
                                type: "retry-to-check-status",
                                dest: { type: "log" },
                                status: { sending: true },
                            },
                            { type: "succeed-to-send-token", dest: { type: "log" } },
                        ])
                        done()
                        break

                    case "failed-to-start-session":
                    case "failed-to-check-status":
                    case "failed-to-send-token":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("submit valid login-id; with long sending", (done) => {
        // wait for send token check limit
        const { resource } = longSendingPasswordResetSessionResource()

        resource.passwordResetSession.onStateChange(stateHandler())

        resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))

        resource.passwordResetSession.startSession()

        function stateHandler(): Post<PasswordResetSessionState> {
            const stack: PasswordResetSessionState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-reset-session":
                    case "try-to-start-session":
                    case "delayed-to-start-session":
                    case "try-to-check-status":
                    case "retry-to-check-status":
                        // work in progress...
                        break

                    case "succeed-to-send-token":
                        done(new Error(state.type))
                        break

                    case "failed-to-check-status":
                        expect(stack).toEqual([
                            { type: "try-to-start-session" },
                            { type: "try-to-check-status" },
                            {
                                type: "retry-to-check-status",
                                dest: { type: "log" },
                                status: { sending: false },
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
                        break

                    case "failed-to-start-session":
                    case "failed-to-send-token":
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
        const { resource } = standardPasswordResetSessionResource()

        resource.passwordResetSession.onStateChange(stateHandler())

        // try to start session without fields
        //resource.loginIDField.set(markInputValue(VALID_LOGIN.loginID))

        resource.passwordResetSession.startSession()

        function stateHandler(): Post<PasswordResetSessionState> {
            const stack: PasswordResetSessionState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-reset-session":
                    case "try-to-start-session":
                    case "delayed-to-start-session":
                    case "try-to-check-status":
                    case "retry-to-check-status":
                        // work in progress...
                        break

                    case "succeed-to-send-token":
                        done(new Error(state.type))
                        break

                    case "failed-to-start-session":
                        expect(stack).toEqual([
                            { type: "failed-to-start-session", err: { type: "validation-error" } },
                        ])
                        done()
                        break

                    case "failed-to-check-status":
                    case "failed-to-send-token":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    describe("fields", () => {
        describe("loginID", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordResetSessionResource()

                resource.loginIDField.onStateChange(stateHandler())

                resource.loginIDField.set(markInputValue(""))

                function stateHandler(): Post<LoginIDFieldState> {
                    return (state) => {
                        expect(state).toMatchObject({
                            type: "succeed-to-update",
                            result: hasError(["empty"]),
                        })
                        done()
                    }
                }
            })
        })
    })
})

function standardPasswordResetSessionResource() {
    const config = standardConfig()
    const simulator = standardSimulator()
    const resource = newPasswordResetSessionResource(config, simulator)

    return { resource }
}
function waitPasswordResetSessionResource() {
    const config = standardConfig()
    const simulator = waitSimulator()
    const resource = newPasswordResetSessionResource(config, simulator)

    return { resource }
}
function longSendingPasswordResetSessionResource() {
    const config = standardConfig()
    const simulator = longSendingSimulator()
    const resource = newPasswordResetSessionResource(config, simulator)

    return { resource }
}

function standardConfig(): PasswordResetSessionConfig {
    return {
        application: {
            secureScriptPath: {
                secureServerHost: "secure.example.com",
            },
        },
        passwordResetSession: {
            startSession: {
                delay: { delay_millisecond: 1 },
            },
            checkStatus: {
                wait: { wait_millisecond: 2 },
                limit: { limit: 5 },
            },
        },
    }
}
function standardSimulator(): PasswordResetSessionSimulator {
    return {
        session: {
            startSession: async (fields) => {
                return simulateStartSession(fields)
            },
            sendToken: async (post) => {
                return simulateSendToken(post, standardSendTokenTime())
            },
            getDestination: async (sessionID) => {
                return simulateGetDestination(sessionID)
            },
        },
    }
}
function waitSimulator(): PasswordResetSessionSimulator {
    return {
        session: {
            startSession: async (fields) => {
                // wait for delayed timeout
                await wait({ wait_millisecond: 3 }, () => null)
                return simulateStartSession(fields)
            },
            sendToken: async (post) => {
                return simulateSendToken(post, standardSendTokenTime())
            },
            getDestination: async (sessionID) => {
                return simulateGetDestination(sessionID)
            },
        },
    }
}
function longSendingSimulator(): PasswordResetSessionSimulator {
    return {
        session: {
            startSession: async (fields) => {
                return simulateStartSession(fields)
            },
            sendToken: async (post) => {
                return simulateSendToken(post, longSendTokenTime())
            },
            getDestination: async (sessionID) => {
                return simulateGetDestination(sessionID)
            },
        },
    }
}

function simulateStartSession(_fields: StartSessionFields): SessionID {
    return markSessionID(SESSION_ID)
}
function standardSendTokenTime(): SendTokenTime {
    return {
        waiting_millisecond: 0,
        sending_millisecond: 2,
        success_millisecond: 4,
    }
}
function longSendTokenTime(): SendTokenTime {
    return {
        waiting_millisecond: 0,
        sending_millisecond: 2,
        success_millisecond: 30, // 2msec 間隔で 5回 check するのでそのあと success する
    }
}
function simulateSendToken(post: Post<SendTokenState>, sendTokenTime: SendTokenTime): true {
    setTimeout(() => {
        post({ state: "waiting" })
    }, sendTokenTime.waiting_millisecond)
    setTimeout(() => {
        post({ state: "sending" })
    }, sendTokenTime.sending_millisecond)
    setTimeout(() => {
        post({ state: "success" })
    }, sendTokenTime.success_millisecond)
    return true
}
function simulateGetDestination(_sessionID: SessionID): Destination {
    return { type: "log" }
}

interface Post<T> {
    (state: T): void
}

type SendTokenTime = {
    waiting_millisecond: number
    sending_millisecond: number
    success_millisecond: number
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
