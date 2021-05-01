import { setupActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { mockAuthenticatePasswordView } from "../password/action_authenticate/mock"
import { mockRequestResetTokenView } from "../password/reset/action_request_token/mock"
import { mockResetPasswordView } from "../password/reset/action_reset/mock"
import { mockCheckResetTokenSendingStatusView } from "../password/reset/action_check_status/mock"
import { mockCheckAuthTicketView } from "../auth_ticket/action_check/mock"
import { mockSignViewLocationDetecter } from "../common/switch_view/mock"

import { initSignLinkResource } from "../common/nav/action_nav/impl"

import { initSignAction } from "./core/impl"
import { initSignView } from "./impl"

import { SignAction } from "./core/action"

describe("SignView", () => {
    test("redirect password authenticate", async () => {
        const { action } = standard()

        const runner = setupActionTestRunner(action.subscriber)

        await runner(async () => {
            const state = await action.ignite()
            switch (state.type) {
                case "check-authTicket":
                    await state.view.resource.core.ignite()
            }
            return state
        }).then((stack) => {
            expect(stack.map((state) => state.type)).toEqual([
                "check-authTicket",
                "password-authenticate",
            ])
        })
    })

    test("static privacy policy", async () => {
        const { action } = static_privacyPolicy()

        const runner = setupActionTestRunner(action.subscriber)

        await runner(async () => {
            const state = await action.ignite()
            switch (state.type) {
                case "check-authTicket":
                    await state.view.resource.core.ignite()
            }
            return state
        }).then((stack) => {
            expect(stack.map((state) => state.type)).toEqual([
                "check-authTicket",
                "static-privacyPolicy",
            ])
        })
    })

    test("password reset request token", async () => {
        const { action } = passwordReset_requestToken()

        const runner = setupActionTestRunner(action.subscriber)

        await runner(async () => {
            const state = await action.ignite()
            switch (state.type) {
                case "check-authTicket":
                    await state.view.resource.core.ignite()
            }
            return state
        }).then((stack) => {
            expect(stack.map((state) => state.type)).toEqual([
                "check-authTicket",
                "password-reset-requestToken",
            ])
        })
    })

    test("password reset check status", async () => {
        const { action } = passwordReset_checkStatus()

        const runner = setupActionTestRunner(action.subscriber)

        await runner(async () => {
            const state = await action.ignite()
            switch (state.type) {
                case "check-authTicket":
                    await state.view.resource.core.ignite()
            }
            return state
        }).then((stack) => {
            expect(stack.map((state) => state.type)).toEqual([
                "check-authTicket",
                "password-reset-checkStatus",
            ])
        })
    })

    test("password reset", async () => {
        const { action } = passwordReset_reset()

        const runner = setupActionTestRunner(action.subscriber)

        await runner(async () => {
            const state = await action.ignite()
            switch (state.type) {
                case "check-authTicket":
                    await state.view.resource.core.ignite()
            }
            return state
        }).then((stack) => {
            expect(stack.map((state) => state.type)).toEqual(["check-authTicket", "password-reset"])
        })
    })

    test("error", async () => {
        const { action } = standard()

        const runner = setupActionTestRunner(action.subscriber)

        await runner(() => action.error("view error")).then((stack) => {
            expect(stack).toEqual([{ type: "error", err: "view error" }])
        })
    })

    test("terminate", async () => {
        const { action } = standard()
        const view = initSignView(action)

        const runner = setupActionTestRunner(action.subscriber)

        await runner(() => {
            view.terminate()
            return view.resource.sign.error("view error")
        }).then((stack) => {
            // no input/validate event after terminate
            expect(stack).toEqual([])
        })
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

        check: () => mockCheckAuthTicketView(),

        password_authenticate: () => mockAuthenticatePasswordView(),
        password_reset: () => mockResetPasswordView(),
        password_reset_requestToken: () => mockRequestResetTokenView(),
        password_reset_checkStatus: () => mockCheckResetTokenSendingStatusView(),
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
