import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { Login } from "./EntryPoint"

import { LoginErrorMockProps, newMockLoginAsError } from "../../../auth/x_components/Login/EntryPoint/mock"
import { initMockPropsPasser } from "../../../sub/getto-example/x_components/Application/mock"

export default {
    title: "Auth/Login/Error",
}

type MockProps = LoginErrorMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<LoginErrorMockProps>()
    const login = newMockLoginAsError(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }): VNode {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(Login, { login })
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
