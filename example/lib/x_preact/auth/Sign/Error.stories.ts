import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { noPadded } from "../../z_storybook/display"

import { EntryPoint } from "./EntryPoint"

import {
    LoginErrorMockProps,
    initMockLoginEntryPointAsError,
} from "../../../auth/z_EntryPoint/Sign/mock"
import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"

export default {
    title: "Auth/Login/Error",
}

type MockProps = LoginErrorMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<LoginErrorMockProps>()
    const entryPoint = initMockLoginEntryPointAsError(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }): VNode {
        useEffect(() => {
            passer.update(props.args)
        })
        return noPadded(h(EntryPoint, entryPoint))
    }
}
interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Error = Template.bind({})
Error.args = {
    error: "error",
}
