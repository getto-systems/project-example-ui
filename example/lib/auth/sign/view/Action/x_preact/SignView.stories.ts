import { h } from "preact"

import { storyTemplate } from "../../../../../z_vendor/storybook/preact/story"

import { SignComponent } from "./SignView"

import { initMockSignAction } from "../Core/mock"

import { SignActionState } from "../Core/action"

export default {
    title: "main/public/Auth/Sign",
    parameters: {
        layout: "fullscreen",
    },
}

type Props = Readonly<{
    err: string
}>
const template = storyTemplate<Props>((props) => {
    return h(SignComponent, {
        view: initMockSignAction(),
        state: state(),
    })

    function state(): SignActionState {
        return { type: "error", err: props.err }
    }
})

export const Error = template({ err: "error" })
