import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../../../../../../x_preact/z_storybook/story"

import { Logout } from "./Logout"

import { initMockPropsPasser } from "../../../../../../../../common/vendor/getto-example/Application/mock"
import { ClearAuthnInfoMockProps, initMockClearAuthnInfoAction } from "../Core/mock"

export default {
    title: "Auth/Profile/Logout",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type Props = ClearAuthnInfoMockProps
const template = storyTemplate<Props>((args) => {
    const passer = initMockPropsPasser<ClearAuthnInfoMockProps>()
    const clear = initMockClearAuthnInfoAction(passer)
    return h(Preview, { args })

    function Preview(props: { args: Props }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(Logout, { clear })
    }
})

export const Initial = template({ type: "initial-clear-authnInfo" })
export const Failed = template({ type: "failed-clear-authnInfo", err: "logout error" })
