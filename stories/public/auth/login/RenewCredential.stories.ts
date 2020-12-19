import { h, VNode } from "preact"

import { newLoginAsRenewCredential } from "../../../../public/lib/auth/Auth/Login/mock"
import {
    mapRenewCredentialMockProps,
    RenewCredentialMockProps,
} from "../../../../public/lib/auth/Auth/renew_credential/mock"

import { Login } from "../../../../public/lib/x_preact/auth/Auth/Login"

export default {
    title: "public/Auth/Login/RenewCredential",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = RenewCredentialMockProps
const Template: Story<MockProps> = (args) => {
    const { login, update } = newLoginAsRenewCredential()
    return h(Preview, { args })

    function Preview(props: { args: MockProps }): VNode {
        update.renewCredential(mapRenewCredentialMockProps(props.args))
        return h(Login, { login })
    }
}
interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Delayed = Template.bind({})
Delayed.args = {
    type: "delayed",
}

export const BadRequest = Template.bind({})
BadRequest.args = {
    type: "bad-request",
}

export const ServerError = Template.bind({})
ServerError.args = {
    type: "server-error",
}

export const BadResponse = Template.bind({})
BadResponse.args = {
    type: "bad-response",
    err: "bad response error",
}

export const InfraError = Template.bind({})
InfraError.args = {
    type: "infra-error",
    err: "infra error",
}
