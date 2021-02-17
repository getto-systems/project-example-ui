import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { AuthProfileLogout } from "./Logout"

import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"
import {
    LogoutResourceMockProps,
    initMockLogoutResource,
} from "../../../auth/x_Resource/Profile/Logout/mock"

export default {
    title: "Auth/Profile/Logout",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = LogoutResourceMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<LogoutResourceMockProps>()
    const resource = initMockLogoutResource(passer)
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

export const Initial = bind({ type: "initial-clear-authnInfo" })
export const Failed = bind({ type: "failed-clear-authnInfo", err: "logout error" })

interface Story<P> {
    args?: P
    (args: P): VNode
}
