import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../../z_storybook/story"

import { RegisterPassword } from "./Register"

import { initMockPropsPasser } from "../../../../../z_getto/application/mock"
import { initMockPasswordResetEntryPoint } from "../../../../../x_main/public/auth/sign/mock"

import { loginIDFormFieldValidations } from "../../../../../auth/common/x_Component/Field/LoginID/mock"
import { formValidationStates } from "../../../../../z_getto/getto-form/x_Resource/Form/mock"
import {
    passwordFormFieldCharacters,
    passwordFormFieldValidations,
    passwordFormFieldViews,
} from "../../../../../auth/common/x_Component/Field/Password/mock"

import { RegisterPasswordResourceMockProps } from "../../../../../auth/x_Resource/Sign/Password/ResetSession/Register/mock"

export default {
    title: "Auth/Sign/Password/ResetSession/Register",
    argTypes: {
        type: {
            table: { disable: true },
        },
        validation: {
            control: { type: "select", options: formValidationStates },
        },
        loginIDValidation: {
            control: { type: "select", options: loginIDFormFieldValidations },
        },
        passwordValidation: {
            control: { type: "select", options: passwordFormFieldValidations },
        },
        passwordCharacter: {
            control: { type: "select", options: passwordFormFieldCharacters },
        },
        passwordView: {
            control: { type: "select", options: passwordFormFieldViews },
        },
    },
}

type MockProps = RegisterPasswordResourceMockProps
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<RegisterPasswordResourceMockProps>()
    const entryPoint = initMockPasswordResetEntryPoint(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(RegisterPassword, entryPoint)
    }
})

const defaultArgs = {
    validation: "initial",
    loginID: "",
    loginIDValidation: "ok",
    password: "",
    passwordValidation: "ok",
    passwordCharacter: "simple",
    passwordView: "hide",
} as const

export const Initial = template({ ...defaultArgs, type: "initial" })
export const Try = template({ ...defaultArgs, type: "try" })
export const Delayed = template({ ...defaultArgs, type: "delayed" })
export const ValidationError = template({ ...defaultArgs, type: "validation-error" })
export const BadRequest = template({ ...defaultArgs, type: "bad-request" })
export const Invalid = template({ ...defaultArgs, type: "invalid" })
export const ServerError = template({ ...defaultArgs, type: "server-error" })
export const BadResponse = template({
    ...defaultArgs,
    type: "bad-response",
    err: "bad response error",
})
export const InfraError = template({
    ...defaultArgs,
    type: "infra-error",
    err: "infra error",
})
