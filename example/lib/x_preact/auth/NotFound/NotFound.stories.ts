import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../z_storybook/story"
import { noPaddedStory } from "../../z_storybook/display"

import { EntryPoint } from "./NotFound"

import { newMockNotFound } from "../../../availability/z_EntryPoint/NotFound/mock"

import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"

import { CurrentVersionMockProps } from "../../../availability/x_Resource/GetCurrentVersion/currentVersion/mock"

export default {
    title: "Auth/NotFound",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = {
    // no props
}
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<CurrentVersionMockProps>()
    const entryPoint = newMockNotFound(passer)
    return h(Preview, { args })

    function Preview(_: { args: MockProps }) {
        useEffect(() => {
            passer.update({ type: "success" })
        })
        return noPaddedStory(h(EntryPoint, entryPoint))
    }
})

export const Initial = template({})
