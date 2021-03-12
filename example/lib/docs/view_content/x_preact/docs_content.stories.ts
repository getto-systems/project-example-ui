import { h } from "preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { mockDocsContentResource } from "../mock"

import { DocsContentComponent } from "./docs_content"

export default {
    title: "main/secure/Docs/Content",
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

export const Content = template({})
