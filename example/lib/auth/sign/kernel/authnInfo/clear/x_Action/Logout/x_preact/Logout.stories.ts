import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../../../../../../x_preact/z_storybook/story"

import { Logout } from "./Logout"

import { initMockPropsPasser } from "../../../../../../../../common/vendor/getto-example/Application/mock"
import { LogoutMockProps, initMockLogoutAction } from "../mock"

export default {
    title: "Auth/Profile/Logout",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type Props = LogoutMockProps
const template = storyTemplate<Props>((args) => {
    const passer = initMockPropsPasser<LogoutMockProps>()
    const action = initMockLogoutAction(passer)
    return h(Preview, { args })

    function Preview(props: { args: Props }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(Logout, { logout: action })
    }
})

export const Initial = template({ type: "initial-logout" })
export const Failed = template({ type: "failed-logout", err: "logout error" })
