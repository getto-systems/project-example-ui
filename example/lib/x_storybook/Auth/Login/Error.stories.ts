import { h, VNode } from "preact"

import { Login } from "../../../x_preact/Auth/Login/Login"

import { newLoginAsError } from "../../../auth/Auth/Login/mock"

export default {
    title: "Auth/Login/Error",
}

type MockProps = Readonly<{
    err: string
}>
const Template: Story<MockProps> = (args) => {
    const { login, update } = newLoginAsError()
    return h(Preview, { args })

    function Preview(props: { args: MockProps }): VNode {
        update.error(props.args.err)
        return h(Login, { login })
    }
}
interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Error = Template.bind({})
Error.args = {
    err: "error",
}
