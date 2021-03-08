import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../z_vendor/storybook/preact/story"

import { AuthenticatePasswordComponent } from "./Authenticate"

import { initMockAuthenticatePasswordResource } from "../mock"

import { AuthenticatePasswordCoreState } from "../core/action"
import { ValidateBoardActionState } from "../../../../../z_vendor/getto-application/board/action_validate_board/core/action"
import { ValidateBoardStateEnum } from "../../../../../z_vendor/getto-application/board/validate_board/data"

enum AuthenticateEnum {
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
    title: "main/public/Auth/Sign/Password/Authenticate",
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        authenticate: {
            control: { type: "select", options: enumKeys(AuthenticateEnum) },
        },
        form: {
            control: { type: "select", options: enumKeys(ValidateBoardStateEnum) },
        },
    },
}

export type Props = Readonly<{
    authenticate: keyof typeof AuthenticateEnum
    form: ValidateBoardActionState
    err: string
}>
const template = storyTemplate<Props>((props) => {
    return h(AuthenticatePasswordComponent, {
        ...initMockAuthenticatePasswordResource(),
        state: { core: state(), form: props.form },
    })

    function state(): AuthenticatePasswordCoreState {
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
