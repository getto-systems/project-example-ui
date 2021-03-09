import { h } from "preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { mockDocsContentResource } from "../mock"

import { DocsContentComponent } from "./EntryPoint"

export default {
    title: "Document/Document",
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = {
    // no props
}
const template = storyTemplate<MockProps>(() => {
    return h(DocsContentComponent, mockDocsContentResource())
})

export const Initial = template({})
