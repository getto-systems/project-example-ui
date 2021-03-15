import { h } from "preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { mockDocsContentResource } from "../mock"

import { DocsComponent } from "./docs"

export default {
    title: "main/secure/Docs",
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = {
    // no props
}
const template = storyTemplate<MockProps>(() => {
    return h(DocsComponent, mockDocsContentResource())
})

export const Content = template({})
