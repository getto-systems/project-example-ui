import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../../../../z_vendor/storybook/preact/story"

import { RequestPasswordResetTokenProps, View } from "./RequestToken"

import { initMockRequestPasswordResetTokenResource } from "../mock"

import { ValidateBoardActionState } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { CoreState } from "../Core/action"
import { ValidateBoardStateEnum } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/data"

const requestOptions = [
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
    title: "library/Auth/Sign/Password/Reset/RequestToken",
    argTypes: {
        request: {
            control: { type: "select", options: requestOptions },
        },
        form: {
            control: { type: "select", options: enumKeys(ValidateBoardStateEnum) },
        },
    },
}

type Props = Readonly<{
    request:
        | "initial"
        | "try"
        | "delayed"
        | "validation-error"
        | "bad-request"
        | "invalid"
        | "server-error"
        | "bad-response"
        | "infra-error"
    form: ValidateBoardActionState
    err: string
}>
const template = storyTemplate<Props>((props) => {
    const resource = initMockRequestPasswordResetTokenResource()
    return h(View, <RequestPasswordResetTokenProps>{
        ...resource,
        state: {
            core: state(),
            form: props.form,
        },
    })

    function state(): CoreState {
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
