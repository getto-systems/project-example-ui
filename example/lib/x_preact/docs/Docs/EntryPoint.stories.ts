import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"
import { noPaddedStory } from "../../../z_vendor/storybook/preact/display"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../z_vendor/getto-application/action/mock"
import {
    DocumentMockPropsPasser,
    newMockDocument,
} from "../../../docs/x_components/Docs/EntryPoint/mock"
import { ContentMockProps } from "../../../docs/x_components/Docs/content/mock"

export default {
    title: "Document/Document",
}

type MockProps = Readonly<{
    // no props
}>
const template = storyTemplate<MockProps>((args) => {
    const passer: DocumentMockPropsPasser = {
        content: initMockPropsPasser<ContentMockProps>(),
    }
    const entryPoint = newMockDocument(passer)
    return h(Preview, { args })

    function Preview(_props: { args: MockProps }) {
        useEffect(() => {
            passer.content.update({ type: "success" })
        })
        return noPaddedStory(h(EntryPoint, entryPoint))
    }
})

export const Initial = template({})
