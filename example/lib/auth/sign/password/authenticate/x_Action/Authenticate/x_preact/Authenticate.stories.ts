import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../../../z_vendor/storybook/preact/story"

import { AuthenticatePasswordProps, View } from "./Authenticate"

import { initMockAuthenticatePasswordResource } from "../mock"

import { CoreState } from "../Core/action"
import { ValidateBoardActionState } from "../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/action"
import { ValidateBoardStateEnum } from "../../../../../../../z_vendor/getto-application/board/validateBoard/data"

const authenticateOptions = {
    initial: true,
    try: true,
    delayed: true,
    "validation-error": true,
    "bad-request": true,
    invalid: true,
    "server-error": true,
    "bad-response": true,
    "infra-error": true,
} as const

export default {
    title: "library/Auth/Sign/Password/Authenticate",
    argTypes: {
        authenticate: {
            control: { type: "select", options: Object.keys(authenticateOptions) },
        },
        form: {
            control: { type: "select", options: enumKeys(ValidateBoardStateEnum) },
        },
    },
}

export type Props = Readonly<{
    authenticate: keyof typeof authenticateOptions
    form: ValidateBoardActionState
    err: string
}>
const template = storyTemplate<Props>((props) => {
    return h(View, <AuthenticatePasswordProps>{
        ...initMockAuthenticatePasswordResource(),
        state: { core: state(), form: props.form },
    })

    function state(): CoreState {
        switch (props.authenticate) {
            case "initial":
                return { type: "initial-login" }

            case "try":
                return { type: "try-to-login" }

            case "delayed":
                return { type: "delayed-to-login" }

            case "validation-error":
                return { type: "failed-to-login", err: { type: "validation-error" } }

            case "bad-request":
                return { type: "failed-to-login", err: { type: "bad-request" } }

            case "invalid":
                return {
                    type: "failed-to-login",
                    err: { type: "invalid-password-login" },
                }

            case "server-error":
                return { type: "failed-to-login", err: { type: "server-error" } }

            case "bad-response":
                return {
                    type: "failed-to-login",
                    err: { type: "bad-response", err: props.err },
                }

            case "infra-error":
                return {
                    type: "failed-to-login",
                    err: { type: "infra-error", err: props.err },
                }
        }
    }
})

export const Box = template({ authenticate: "initial", form: "valid", err: "" })
