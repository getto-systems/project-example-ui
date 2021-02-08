import { h, VNode } from "preact"

import { Example } from "../../../x_preact/Example/Home/Example"

import {
    mapExampleMockProps,
    ExampleMockProps,
    initMockExampleComponent,
} from "../../../example/Home/example/mock"

import { initialExampleComponentState } from "../../../example/Home/example/component"

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
    const example = initMockExampleComponent(initialExampleComponentState)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        example.update(mapExampleMockProps(props.args))
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
