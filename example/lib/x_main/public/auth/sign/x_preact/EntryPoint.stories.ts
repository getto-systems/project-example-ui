import { h } from "preact"

import { storyTemplate } from "../../../../../z_vendor/storybook/preact/story"

import { AuthSignProps, View } from "./EntryPoint"

import { initMockAuthSignAction } from "../mock"

import { AuthSignActionState } from "../entryPoint"

export default {
    title: "main/Auth/Sign",
    parameters: {
        layout: "fullscreen",
    },
}

type Props = Readonly<{
    err: string
}>
const template = storyTemplate<Props>((props) => {
    const action = initMockAuthSignAction()
    return h(View, <AuthSignProps>{
        view: action,
        state: state(),
    })

    function state(): AuthSignActionState {
        return { type: "error", err: props.err }
    }
})

export const Error = template({ err: "error" })
