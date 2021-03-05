import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../../../z_vendor/storybook/preact/story"

import { RequestResetTokenComponent } from "./RequestResetToken"

import { initMockRequestResetTokenResource } from "../mock"

import { ValidateBoardActionState } from "../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { RequestResetTokenCoreState } from "../Core/action"
import { ValidateBoardStateEnum } from "../../../../../../../z_vendor/getto-application/board/validateBoard/data"

enum RequestEnum {
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
    title: "library/Auth/Sign/Password/Reset/RequestToken",
    argTypes: {
        request: {
            control: { type: "select", options: enumKeys(RequestEnum) },
        },
        form: {
            control: { type: "select", options: enumKeys(ValidateBoardStateEnum) },
        },
    },
}

type Props = Readonly<{
    request: keyof typeof RequestEnum
    form: ValidateBoardActionState
    err: string
}>
const template = storyTemplate<Props>((props) => {
    return h(RequestResetTokenComponent, {
        ...initMockRequestResetTokenResource(),
        state: {
            core: state(),
            form: props.form,
        },
    })

    function state(): RequestResetTokenCoreState {
        switch (props.request) {
            case "initial":
                return { type: "initial-request-token" }

            case "try":
                return { type: "try-to-request-token" }

            case "delayed":
                return { type: "delayed-to-request-token" }

            case "validation-error":
                return {
                    type: "failed-to-request-token",
                    err: { type: "validation-error" },
                }

            case "bad-request":
                return {
                    type: "failed-to-request-token",
                    err: { type: "bad-request" },
                }

            case "invalid":
                return {
                    type: "failed-to-request-token",
                    err: { type: "invalid-password-reset" },
                }

            case "server-error":
                return {
                    type: "failed-to-request-token",
                    err: { type: "server-error" },
                }

            case "bad-response":
                return {
                    type: "failed-to-request-token",
                    err: { type: "bad-response", err: props.err },
                }

            case "infra-error":
                return {
                    type: "failed-to-request-token",
                    err: { type: "infra-error", err: props.err },
                }
        }
    }
})

export const Box = template({
    request: "initial",
    form: "valid",
    err: "",
})
