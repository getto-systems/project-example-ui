import { h } from "preact"

import { storyTemplate } from "../../../../../../../../z_vendor/storybook/preact/story"

import { CheckPasswordResetSendingStatusProps, View } from "./CheckStatus"

import { initMockStartPasswordResetSessionResource } from "../mock"

import { CheckSendingStatusState } from "../action"

const checkStatusOptions = [
    "initial",
    "check",
    "waiting",
    "sending",
    "bad-request",
    "invalid",
    "server-error",
    "bad-response",
    "infra-error",
    "send-error",
    "send",
] as const

export default {
    title: "library/Auth/Sign/Password/ResetSession/Start",
    argTypes: {
        checkStatus: {
            control: { type: "select", options: checkStatusOptions },
        },
    },
}

type Props = Readonly<{
    checkStatus:
        | "initial"
        | "check"
        | "waiting"
        | "sending"
        | "bad-request"
        | "invalid"
        | "server-error"
        | "bad-response"
        | "infra-error"
        | "send-error"
        | "send"
    err: string
}>
const template = storyTemplate<Props>((props) => {
    const resource = initMockStartPasswordResetSessionResource()
    return h(View, <CheckPasswordResetSendingStatusProps>{
        ...resource,
        state: state(),
    })

    function state(): CheckSendingStatusState {
        switch (props.checkStatus) {
            case "initial":
                return { type: "initial-check-status" }

            case "check":
                return { type: "try-to-check-status" }

            case "waiting":
                return {
                    type: "retry-to-check-status",
                    status: { sending: false },
                }

            case "sending":
                return {
                    type: "retry-to-check-status",
                    status: { sending: true },
                }

            case "bad-request":
                return {
                    type: "failed-to-check-status",
                    err: { type: "bad-request" },
                }

            case "invalid":
                return {
                    type: "failed-to-check-status",
                    err: { type: "invalid-password-reset" },
                }

            case "server-error":
                return {
                    type: "failed-to-check-status",
                    err: { type: "server-error" },
                }

            case "bad-response":
                return {
                    type: "failed-to-check-status",
                    err: { type: "bad-response", err: props.err },
                }

            case "infra-error":
                return {
                    type: "failed-to-check-status",
                    err: { type: "infra-error", err: props.err },
                }

            case "send-error":
                return {
                    type: "failed-to-send-token",
                    err: { type: "infra-error", err: props.err },
                }

            case "send":
                return { type: "succeed-to-send-token" }
        }
    }
})

export const Box = template({
    checkStatus: "initial",
    err: "",
})
