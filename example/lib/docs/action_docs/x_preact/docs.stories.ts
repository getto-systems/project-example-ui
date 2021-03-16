import { h } from "preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { mockDocsResource } from "../mock"

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
    return h(DocsComponent, mockDocsResource())
})

export const Content = template({})
