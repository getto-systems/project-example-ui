import { h } from "preact"

import { storyTemplate } from "../../../../../../../../z_vendor/storybook/preact/story"

import { View } from "./Logout"

import { initMockLogoutAction } from "../mock"
import { LogoutState } from "../action"

const logoutOptions = ["initial", "failed"] as const

export default {
    title: "library/Auth/Profile/Logout",
    argTypes: {
        logout: {
            control: { type: "select", options: logoutOptions },
        },
    },
}

type Props = Readonly<{
    logout: "initial" | "failed"
    err: string
}>

const template = storyTemplate<Props>((props) => {
    const action = initMockLogoutAction()
    return h(View, { logout: action, state: state() })

    function state(): LogoutState {
        switch (props.logout) {
            case "initial":
                return { type: "initial-logout" }

            case "failed":
                return {
                    type: "failed-to-logout",
                    err: { type: "infra-error", err: props.err },
                }
        }
    }
})

export const Box = template({ logout: "initial", err: "" })
