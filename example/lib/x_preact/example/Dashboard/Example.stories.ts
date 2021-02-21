import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { Example } from "./Example"

import { initMockPropsPasser } from "../../../z_getto/application/mock"
import {
    ExampleMockProps,
    initMockExampleComponent,
} from "../../../example/x_components/Dashboard/example/mock"

export default {
    title: "Example/Home/Example",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = ExampleMockProps
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<ExampleMockProps>()
    const example = initMockExampleComponent(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(Example, { example })
    }
})

export const Success = template({ type: "success", year: new Date().getFullYear() })
export const Failed = template({ type: "failed", err: "load error" })
