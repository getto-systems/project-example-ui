import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { ClearCredential } from "./ClearCredential"

import { initMockPropsPasser } from "../../../vendor/getto-example/Application/mock"
import {
    AuthProfileLogoutMockProps,
    initMockAuthProfileLogoutResource,
} from "../../../auth/z_EntryPoint/Profile/resources/Logout/mock"

export default {
    title: "Auth/Profile/ClearCredential",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = AuthProfileLogoutMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<AuthProfileLogoutMockProps>()
    const resource = initMockAuthProfileLogoutResource(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(ClearCredential, resource)
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Failed = Template.bind({})
Failed.args = {
    type: "failed",
    err: "logout error",
}
