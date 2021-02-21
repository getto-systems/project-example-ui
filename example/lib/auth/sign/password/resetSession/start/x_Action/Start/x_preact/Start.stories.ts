import { h } from "preact"

import { storyTemplate } from "../../../../../../../../z_vendor/storybook/preact/story"

import { StartPasswordResetSessionProps, View } from "./Start"

import { initMockStartPasswordResetSessionResource } from "../mock"
import { validateBoardOptions } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/mock"

import { ValidateBoardState } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { StartPasswordResetSessionCoreState } from "../Core/action"

const startOptions = [
    "initial",
    "try",
    "delayed",
    "validation-error",
    "bad-request",
    "invalid",
    "server-error",
    "bad-response",
    "infra-error",
    "check",
    "waiting",
    "sending",
    "check-bad-request",
    "check-invalid",
    "check-server-error",
    "check-bad-response",
    "check-infra-error",
    "send-error",
    "send",
] as const

export default {
    title: "library/Auth/Sign/Password/ResetSession/Start",
    argTypes: {
        start: {
            control: { type: "select", options: startOptions },
        },
        form: {
            control: { type: "select", options: validateBoardOptions },
        },
    },
}

type Props = Readonly<{
    start:
        | "initial"
        | "try"
        | "delayed"
        | "validation-error"
        | "bad-request"
        | "invalid"
        | "server-error"
        | "bad-response"
        | "infra-error"
        | "check"
        | "waiting"
        | "sending"
        | "check-bad-request"
        | "check-invalid"
        | "check-server-error"
        | "check-bad-response"
        | "check-infra-error"
        | "send-error"
        | "send"
    form: ValidateBoardState
    err: string
}>
const template = storyTemplate<Props>((props) => {
    const resource = initMockStartPasswordResetSessionResource()
    return h(View, <StartPasswordResetSessionProps>{
        ...resource,
        state: {
            core: state(),
            form: props.form,
        },
    })

    function state(): StartPasswordResetSessionCoreState {
        switch (props.start) {
            case "initial":
                return { type: "initial-reset-session" }

            case "try":
                return { type: "try-to-start-session" }

            case "delayed":
                return { type: "delayed-to-start-session" }

            case "validation-error":
                return {
                    type: "failed-to-start-session",
                    err: { type: "validation-error" },
                }

            case "bad-request":
                return {
                    type: "failed-to-start-session",
                    err: { type: "bad-request" },
                }

            case "invalid":
                return {
                    type: "failed-to-start-session",
                    err: { type: "invalid-password-reset" },
                }

            case "server-error":
                return {
                    type: "failed-to-start-session",
                    err: { type: "server-error" },
                }

            case "bad-response":
                return {
                    type: "failed-to-start-session",
                    err: { type: "bad-response", err: props.err },
                }

            case "infra-error":
                return {
                    type: "failed-to-start-session",
                    err: { type: "infra-error", err: props.err },
                }

            case "check":
                return { type: "try-to-check-status" }

            case "waiting":
                return {
                    type: "retry-to-check-status",
                    dest: { type: "log" },
                    status: { sending: false },
                }

            case "sending":
                return {
                    type: "retry-to-check-status",
                    dest: { type: "log" },
                    status: { sending: true },
                }

            case "check-bad-request":
                return {
                    type: "failed-to-check-status",
                    err: { type: "bad-request" },
                }

            case "check-invalid":
                return {
                    type: "failed-to-check-status",
                    err: { type: "invalid-password-reset" },
                }

            case "check-server-error":
                return {
                    type: "failed-to-check-status",
                    err: { type: "server-error" },
                }

            case "check-bad-response":
                return {
                    type: "failed-to-check-status",
                    err: { type: "bad-response", err: props.err },
                }

            case "check-infra-error":
                return {
                    type: "failed-to-check-status",
                    err: { type: "infra-error", err: props.err },
                }

            case "send-error":
                // TODO log 以外に対応したら type を props から取得するように
                return {
                    type: "failed-to-send-token",
                    dest: { type: "log" },
                    err: { type: "infra-error", err: props.err },
                }

            case "send":
                // TODO log 以外に対応したら type を props から取得するように
                return { type: "succeed-to-send-token", dest: { type: "log" } }
        }
    }
})

export const Box = template({
    start: "initial",
    form: "valid",
    err: "",
})
