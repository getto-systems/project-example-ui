import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../sub/getto-example/x_components/Application/mock"
import { newMockLoginAsRenewCredential } from "../../../auth/z_EntryPoint/Login/EntryPoint/mock"
import { RenewCredentialResourceMockProps } from "../../../auth/x_Resource/Login/RenewCredential/mock"

export default {
    title: "Auth/Login/RenewCredential",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = RenewCredentialResourceMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<RenewCredentialResourceMockProps>()
    const entryPoint = newMockLoginAsRenewCredential(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }): VNode {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(EntryPoint, entryPoint)
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
