import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { Login } from "../../../x_preact/Auth/Login/Login"

import { initMockPropsPasser } from "../../../sub/getto-example/application/mock"
import { newMockLoginAsRenewCredential } from "../../../auth/Auth/Login/mock"
import { RenewCredentialMockProps } from "../../../auth/Auth/renewCredential/mock"

export default {
    title: "Auth/Login/RenewCredential",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = RenewCredentialMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<RenewCredentialMockProps>()
    const login = newMockLoginAsRenewCredential(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }): VNode {
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
