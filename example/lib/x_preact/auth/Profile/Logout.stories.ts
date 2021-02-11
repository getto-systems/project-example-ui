import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { Logout } from "./Logout"

import { initMockPropsPasser } from "../../../sub/getto-example/x_components/Application/mock"
import {
    ExampleMockProps,
    initMockExampleComponent,
} from "../../../auth/x_components/Profile/logout/mock"

export default {
    title: "Auth/Profile/Logout",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = ExampleMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<ExampleMockProps>()
    const example = initMockExampleComponent(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(Logout, { example })
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Success = Template.bind({})
Success.args = {
    type: "success",
    year: new Date().getFullYear(),
}

export const Failed = Template.bind({})
Failed.args = {
    type: "failed",
    err: "load error",
}
