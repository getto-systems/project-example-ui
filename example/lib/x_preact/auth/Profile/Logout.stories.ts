import { h } from "preact"
import { useEffect } from "preact/hooks"

import { Logout } from "./Logout"

import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"
import {
    LogoutResourceMockProps,
    initMockLogoutResource,
} from "../../../auth/x_Resource/Profile/Logout/mock"
import { storyTemplate } from "../../z_storybook/story"

export default {
    title: "Auth/Profile/Logout",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type Props = LogoutResourceMockProps
const template = storyTemplate<Props>((args) => {
    const passer = initMockPropsPasser<LogoutResourceMockProps>()
    const resource = initMockLogoutResource(passer)
    return h(Preview, { args })

    function Preview(props: { args: Props }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(Logout, resource)
    }
})

export const Initial = template({ type: "initial-clear-authnInfo" })
export const Failed = template({ type: "failed-clear-authnInfo", err: "logout error" })
