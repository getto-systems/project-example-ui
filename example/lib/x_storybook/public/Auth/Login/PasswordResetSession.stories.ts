import { h, VNode } from "preact"

import { newLoginAsPasswordResetSession } from "../../../../auth/Auth/Login/mock"
import {
    mapPasswordResetSessionMockProps,
    PasswordResetSessionMockProps,
} from "../../../../auth/Auth/password_reset_session/mock"
import {
    mapLoginIDFieldMockProps,
    loginIDFieldMockTypes,
    LoginIDFieldMockProps,
} from "../../../../auth/Auth/field/login_id/mock"

import { Login } from "../../../../x_preact/public/Auth/Login"

export default {
    title: "public/Auth/Login/PasswordResetSession",
    argTypes: {
        type: {
            table: { disable: true },
        },
        loginIDField: {
            control: {
                type: "select",
                options: loginIDFieldMockTypes,
            },
        },
    },
}

type MockProps = PasswordResetSessionMockProps & LoginIDFieldMockProps
const Template: Story<MockProps> = (args) => {
    const { login, update } = newLoginAsPasswordResetSession()
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        updateState(props.args)
        return h(Login, { login })
    }
    function updateState(args: MockProps) {
        update.passwordResetSession(mapPasswordResetSessionMockProps(args))
        update.loginIDField(mapLoginIDFieldMockProps(args))
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

const defaultArgs = {
    loginIDField: "initial",
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
