import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { Example } from "./Example"

import { initMockPropsPasser } from "../../../sub/getto-example/x_components/Application/mock"
import { ExampleMockProps, initMockExampleComponent } from "../../../example/x_components/Dashboard/example/mock"

export default {
    title: "Example/Home/Example",
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
        return h(Example, { example })
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
