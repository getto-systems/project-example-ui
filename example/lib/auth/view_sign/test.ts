import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../z_vendor/getto-application/action/test_helper"

import { mockAuthenticatePasswordEntryPoint } from "../sign/password/view_authenticate/mock"
import { mockRequestResetTokenEntryPoint } from "../sign/password/reset/view_request_token/mock"
import { mockResetPasswordEntryPoint } from "../sign/password/reset/view_reset/mock"
import { mockCheckResetTokenSendingStatusEntryPoint } from "../sign/password/reset/view_check_status/mock"
import { mockCheckAuthTicketEntryPoint } from "../sign/auth_info/action_check/mock"
import { mockSignViewLocationDetecter } from "../sign/view/impl/mock"

import { initSignLinkResource } from "../sign/common/nav/action_nav/impl"

import { initSignAction } from "./core/impl"
import { initSignEntryPoint } from "./impl"

import { SignAction, SignActionState } from "./core/action"

describe("SignView", () => {
    test("redirect password authenticate", (done) => {
        const { action } = standard()

        action.subscriber.subscribe((state) => {
            switch (state.type) {
                case "check-authTicket":
                    state.entryPoint.resource.core.ignite()
                    return
            }
        })

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    action.ignite()
                },
                examine: (stack) => {
                    expect(stack.map((state) => state.type)).toEqual([
                        "check-authTicket",
                        "password-authenticate",
                    ])
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("static privacy policy", (done) => {
        const { action } = static_privacyPolicy()

        action.subscriber.subscribe((state) => {
            switch (state.type) {
                case "check-authTicket":
                    state.entryPoint.resource.core.ignite()
                    return
            }
        })

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    action.ignite()
                },
                examine: (stack) => {
                    expect(stack.map((state) => state.type)).toEqual([
                        "check-authTicket",
                        "static-privacyPolicy",
                    ])
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("password reset request token", (done) => {
        const { action } = passwordReset_requestToken()

        action.subscriber.subscribe((state) => {
            switch (state.type) {
                case "check-authTicket":
                    state.entryPoint.resource.core.ignite()
                    return
            }
        })

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    action.ignite()
                },
                examine: (stack) => {
                    expect(stack.map((state) => state.type)).toEqual([
                        "check-authTicket",
                        "password-reset-requestToken",
                    ])
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("password reset check status", (done) => {
        const { action } = passwordReset_checkStatus()

        action.subscriber.subscribe((state) => {
            switch (state.type) {
                case "check-authTicket":
                    state.entryPoint.resource.core.ignite()
                    return
            }
        })

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    action.ignite()
                },
                examine: (stack) => {
                    expect(stack.map((state) => state.type)).toEqual([
                        "check-authTicket",
                        "password-reset-checkStatus",
                    ])
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("password reset", (done) => {
        const { action } = passwordReset_reset()

        action.subscriber.subscribe((state) => {
            switch (state.type) {
                case "check-authTicket":
                    state.entryPoint.resource.core.ignite()
                    return
            }
        })

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    action.ignite()
                },
                examine: (stack) => {
                    expect(stack.map((state) => state.type)).toEqual([
                        "check-authTicket",
                        "password-reset",
                    ])
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("error", (done) => {
        const { action } = standard()

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    action.error("view error")
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ type: "error", err: "view error" }])
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("terminate", (done) => {
        const { action } = standard()
        const entryPoint = initSignEntryPoint(action)

        const runner = setupSyncActionTestRunner([
            {
                statement: () => {
                    entryPoint.terminate()
                    entryPoint.resource.view.error("view error")
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        entryPoint.resource.view.subscriber.subscribe(runner(done))
    })
})

function standard() {
    const currentURL = standard_URL()
    const action = initAction(currentURL)

    return { action }
}
function static_privacyPolicy() {
    const currentURL = static_privacyPolicy_URL()
    const action = initAction(currentURL)

    return { action }
}
function passwordReset_requestToken() {
    const currentURL = passwordReset_requestToken_URL()
    const action = initAction(currentURL)

    return { action }
}
function passwordReset_checkStatus() {
    const currentURL = passwordReset_checkStatus_URL()
    const action = initAction(currentURL)

    return { action }
}
function passwordReset_reset() {
    const currentURL = passwordReset_reset_URL()
    const action = initAction(currentURL)

    return { action }
}

function initAction(currentURL: URL): SignAction {
    return initSignAction(mockSignViewLocationDetecter(currentURL), {
        link: () => initSignLinkResource(),

        check: () => mockCheckAuthTicketEntryPoint(),

        password_authenticate: () => mockAuthenticatePasswordEntryPoint(),
        password_reset: () => mockResetPasswordEntryPoint(),
        password_reset_requestToken: () => mockRequestResetTokenEntryPoint(),
        password_reset_checkStatus: () => mockCheckResetTokenSendingStatusEntryPoint(),
    })
}

function standard_URL(): URL {
    return new URL("https://example.com/index.html")
}
function static_privacyPolicy_URL(): URL {
    return new URL("https://example.com/index.html?-static=privacy-policy")
}
function passwordReset_requestToken_URL(): URL {
    return new URL("https://example.com/index.html?-password-reset=request-token")
}
function passwordReset_checkStatus_URL(): URL {
    return new URL("https://example.com/index.html?-password-reset=check-status")
}
function passwordReset_reset_URL(): URL {
    return new URL("https://example.com/index.html?-password-reset=reset")
}

function actionHasDone(state: SignActionState): boolean {
    switch (state.type) {
        case "initial-view":
        case "check-authTicket":
            return false

        default:
            return true
    }
}
