import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../../../z_vendor/storybook/preact/story"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../../../z_getto/application/mock"

import { LoginErrorMockProps, initMockLoginEntryPointAsError } from "../mock"

export default {
    title: "main/Auth/Sign",
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = LoginErrorMockProps
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<LoginErrorMockProps>()
    const entryPoint = initMockLoginEntryPointAsError(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }): VNode {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(EntryPoint, entryPoint)
    }
})

export const Error = template({ error: "error" })
