import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { Login } from "./EntryPoint"

import { initMockPropsPasser } from "../../../sub/getto-example/x_components/Application/mock"
import { newMockLoginAsPasswordResetSession } from "../../../auth/x_components/Login/EntryPoint/mock"
import { PasswordResetSessionMockProps } from "../../../auth/x_components/Login/passwordResetSession/mock"
import { formValidationStates } from "../../../sub/getto-form/x_components/Form/mock"
import { loginIDFormFieldValidations } from "../../../auth/x_components/Login/field/loginID/mock"

export default {
    title: "Auth/Login/PasswordResetSession",
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
    },
}

type MockProps = PasswordResetSessionMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<PasswordResetSessionMockProps>()
    const login = newMockLoginAsPasswordResetSession(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(Login, { login })
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

export const Check = Template.bind({})
Check.args = {
    ...defaultArgs,
    type: "check",
}

export const Waiting = Template.bind({})
Waiting.args = {
    ...defaultArgs,
    type: "waiting",
}

export const Sending = Template.bind({})
Sending.args = {
    ...defaultArgs,
    type: "sending",
}

export const CheckBadRequest = Template.bind({})
CheckBadRequest.args = {
    ...defaultArgs,
    type: "check-bad-request",
}

export const CheckInvalid = Template.bind({})
CheckInvalid.args = {
    ...defaultArgs,
    type: "check-invalid",
}

export const CheckServerError = Template.bind({})
CheckServerError.args = {
    ...defaultArgs,
    type: "check-server-error",
}

export const CheckBadResponse = Template.bind({})
CheckBadResponse.args = {
    ...defaultArgs,
    type: "check-bad-response",
    err: "bad response error",
}

export const CheckInfraError = Template.bind({})
CheckInfraError.args = {
    ...defaultArgs,
    type: "check-infra-error",
    err: "infra error",
}

export const SendError = Template.bind({})
SendError.args = {
    ...defaultArgs,
    type: "send-error",
    err: "send error",
}

export const Send = Template.bind({})
Send.args = {
    ...defaultArgs,
    type: "send",
}