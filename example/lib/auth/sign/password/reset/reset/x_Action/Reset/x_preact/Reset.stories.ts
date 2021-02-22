import { h } from "preact"

import { storyTemplate } from "../../../../../../../../z_vendor/storybook/preact/story"

import { ResetPasswordProps, View } from "./Reset"

import { initMockResetPasswordResource } from "../mock"
import { validateBoardOptions } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/mock"

import { ValidateBoardState } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/action"
import { ResetPasswordCoreState } from "../Core/action"

const resetOptions = [
    "initial",
    "try",
    "delayed",
    "validation-error",
    "bad-request",
    "invalid",
    "server-error",
    "bad-response",
    "infra-error",
] as const

export default {
    title: "Auth/Sign/Password/ResetSession/Register",
    argTypes: {
        reset: {
            control: { type: "select", options: resetOptions },
        },
        form: {
            control: { type: "select", options: validateBoardOptions },
        },
    },
}

type Props = Readonly<{
    reset:
        | "initial"
        | "try"
        | "delayed"
        | "validation-error"
        | "bad-request"
        | "invalid"
        | "server-error"
        | "bad-response"
        | "infra-error"
    form: ValidateBoardState
    err: string
}>
const template = storyTemplate<Props>((props) => {
    return h(View, <ResetPasswordProps>{
        ...initMockResetPasswordResource(),
        state: { core: state(), form: props.form },
    })

    function state(): ResetPasswordCoreState {
        switch (props.reset) {
            case "initial":
                return { type: "initial-reset" }

            case "try":
                return { type: "try-to-reset" }

            case "delayed":
                return { type: "delayed-to-reset" }

            case "validation-error":
                return { type: "failed-to-reset", err: { type: "validation-error" } }

            case "bad-request":
                return { type: "failed-to-reset", err: { type: "bad-request" } }

            case "invalid":
                return {
                    type: "failed-to-reset",
                    err: { type: "invalid-password-reset" },
                }

            case "server-error":
                return { type: "failed-to-reset", err: { type: "server-error" } }

            case "bad-response":
                return {
                    type: "failed-to-reset",
                    err: { type: "bad-response", err: props.err },
                }

            case "infra-error":
                return {
                    type: "failed-to-reset",
                    err: { type: "infra-error", err: props.err },
                }
        }
    }
})

export const Box = template({ reset: "initial", form: "valid", err: "" })
