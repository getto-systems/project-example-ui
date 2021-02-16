import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { PasswordReset } from "./PasswordReset"

import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"
import { initMockPasswordResetEntryPoint } from "../../../auth/z_EntryPoint/Sign/mock"
import { PasswordResetResourceMockProps } from "../../../auth/z_EntryPoint/Sign/resources/Password/Reset/Register/mock"
import { loginIDFormFieldValidations } from "../../../auth/common/x_Component/Field/LoginID/mock"
import { formValidationStates } from "../../../common/vendor/getto-form/x_Resource/Form/mock"
import {
    passwordFormFieldCharacters,
    passwordFormFieldValidations,
    passwordFormFieldViews,
} from "../../../auth/common/x_Component/Field/Password/mock"

export default {
    title: "Auth/Login/PasswordReset",
    argTypes: {
        type: {
            table: { disable: true },
        },
        validation: {
            control: {
                type: "select",
                options: formValidationStates,
            },
        },
        loginIDValidation: {
            control: {
                type: "select",
                options: loginIDFormFieldValidations,
            },
        },
        passwordValidation: {
            control: {
                type: "select",
                options: passwordFormFieldValidations,
            },
        },
        passwordCharacter: {
            control: {
                type: "select",
                options: passwordFormFieldCharacters,
            },
        },
        passwordView: {
            control: {
                type: "select",
                options: passwordFormFieldViews,
            },
        },
    },
}

type MockProps = PasswordResetResourceMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<PasswordResetResourceMockProps>()
    const entryPoint = initMockPasswordResetEntryPoint(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(PasswordReset, entryPoint)
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

const defaultArgs = {
    validation: "initial",
    loginID: "",
    loginIDValidation: "ok",
    password: "",
    passwordValidation: "ok",
    passwordCharacter: "simple",
    passwordView: "hide",
} as const

export const Initial = Template.bind({})
Initial.args = {
    ...defaultArgs,
    type: "initial",
}

export const Try = Template.bind({})
Try.args = {
    ...defaultArgs,
    type: "try",
}

export const Delayed = Template.bind({})
Delayed.args = {
    ...defaultArgs,
    type: "delayed",
}

export const ValidationError = Template.bind({})
ValidationError.args = {
    ...defaultArgs,
    type: "validation-error",
}

export const BadRequest = Template.bind({})
BadRequest.args = {
    ...defaultArgs,
    type: "bad-request",
}

export const Invalid = Template.bind({})
Invalid.args = {
    ...defaultArgs,
    type: "invalid",
}

export const ServerError = Template.bind({})
ServerError.args = {
    ...defaultArgs,
    type: "server-error",
}

export const BadResponse = Template.bind({})
BadResponse.args = {
    ...defaultArgs,
    type: "bad-response",
    err: "bad response error",
}

export const InfraError = Template.bind({})
InfraError.args = {
    ...defaultArgs,
    type: "infra-error",
    err: "infra error",
}
