import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../../z_vendor/storybook/preact/story"

import { ResetPasswordComponent } from "./ResetPassword"

import { initMockResetPasswordResource } from "../mock"

import { ValidateBoardActionState } from "../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { ResetPasswordCoreState } from "../core/action"
import { ValidateBoardStateEnum } from "../../../../../../z_vendor/getto-application/board/validateBoard/data"

enum ResetEnum {
    "initial",
    "try",
    "delayed",
    "validation-error",
    "bad-request",
    "invalid",
    "server-error",
    "bad-response",
    "infra-error",
}

export default {
    title: "main/public/Auth/Sign/Password/Reset/Reset",
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        reset: {
            control: { type: "select", options: enumKeys(ResetEnum) },
        },
        form: {
            control: { type: "select", options: enumKeys(ValidateBoardStateEnum) },
        },
    },
}

type Props = Readonly<{
    reset: keyof typeof ResetEnum
    form: ValidateBoardActionState
    err: string
}>
const template = storyTemplate<Props>((props) => {
    return h(ResetPasswordComponent, {
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
