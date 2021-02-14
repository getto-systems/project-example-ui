import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { PasswordResetSession } from "./PasswordResetSession"

import { initMockPropsPasser } from "../../../vendor/getto-example/Application/mock"
import { initMockPasswordResetSessionEntryPoint } from "../../../auth/z_EntryPoint/Sign/mock"
import { PasswordResetSessionResourceMockProps } from "../../../auth/x_Resource/Sign/PasswordResetSession/mock"
import { formValidationStates } from "../../../vendor/getto-form/x_Resource/Form/mock"
import { loginIDFormFieldValidations } from "../../../auth/x_Resource/common/Field/LoginID/mock"

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

type MockProps = PasswordResetSessionResourceMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<PasswordResetSessionResourceMockProps>()
    const entryPoint = initMockPasswordResetSessionEntryPoint(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(PasswordResetSession, entryPoint)
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
