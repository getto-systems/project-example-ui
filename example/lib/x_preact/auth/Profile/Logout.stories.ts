import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { AuthProfileLogout } from "./Logout"

import { initMockPropsPasser } from "../../../vendor/getto-example/Application/mock"
import {
    AuthProfileLogoutResourceMockProps,
    initMockAuthProfileLogoutResource,
} from "../../../auth/z_EntryPoint/Profile/resources/Logout/mock"

export default {
    title: "Auth/Profile/Logout",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = AuthProfileLogoutResourceMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<AuthProfileLogoutResourceMockProps>()
    const resource = initMockAuthProfileLogoutResource(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(AuthProfileLogout, resource)
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
