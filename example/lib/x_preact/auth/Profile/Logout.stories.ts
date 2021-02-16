import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { AuthProfileLogout } from "./Logout"

import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"
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
function bind(props: MockProps) {
    const template = Template.bind({})
    template.args = props
    return template
}

export const Initial = bind({ type: "initial-clear-authCredential" })
export const Failed = bind({ type: "failed-clear-authCredential", err: "logout error" })

interface Story<P> {
    args?: P
    (args: P): VNode
}
