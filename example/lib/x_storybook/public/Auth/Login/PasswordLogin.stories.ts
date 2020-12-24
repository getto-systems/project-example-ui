import { h, VNode } from "preact"

import { Login } from "../../../../x_preact/public/Auth/Login"

import { newLoginAsPasswordLogin } from "../../../../auth/Auth/Login/mock"
import { mapPasswordLoginMockProps, PasswordLoginMockProps } from "../../../../auth/Auth/password_login/mock"
import {
    mapLoginIDFieldMockProps,
    loginIDFieldMockTypes,
    LoginIDFieldMockProps,
} from "../../../../auth/Auth/field/login_id/mock"
import {
    mapPasswordFieldMockProps,
    PasswordFieldMockProps,
    passwordFieldMockTypes,
} from "../../../../auth/Auth/field/password/mock"

export default {
    title: "public/Auth/Login/PasswordLogin",
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
        passwordField: {
            control: {
                type: "select",
                options: passwordFieldMockTypes,
            },
        },
    },
}

type MockProps = PasswordLoginMockProps & LoginIDFieldMockProps & PasswordFieldMockProps
const Template: Story<MockProps> = (args) => {
    const { login, update } = newLoginAsPasswordLogin()
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        updateState(props.args)
        return h(Login, { login })
    }
    function updateState(args: MockProps) {
        update.passwordLogin(mapPasswordLoginMockProps(args))
        update.loginIDField(mapLoginIDFieldMockProps(args))
        update.passwordField(mapPasswordFieldMockProps(args))
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

const defaultArgs = {
    loginIDField: "initial",
    passwordField: "initial",
    password: "",
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
