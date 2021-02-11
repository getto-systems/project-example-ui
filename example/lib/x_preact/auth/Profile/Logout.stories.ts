import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { Logout } from "./Logout"

import { initMockPropsPasser } from "../../../sub/getto-example/x_components/Application/mock"
import {
    LogoutMockProps,
    initMockLogoutComponent,
} from "../../../auth/x_components/Profile/logout/mock"

export default {
    title: "Auth/Profile/Logout",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = LogoutMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<LogoutMockProps>()
    const logout = initMockLogoutComponent(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(Logout, { logout })
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
