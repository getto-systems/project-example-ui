import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { BreadcrumbList } from "../../system/breadcrumb"

import { DocumentComponentSet } from "../../../Document/document/view"
import { initialContentState } from "../../../Document/component/content/component"
import { DocumentPath } from "../../../content/data"

import { content_index } from "./content/index"

export function Content(components: DocumentComponentSet): VNode {
    const content = components.content

    const [state, setState] = useState(initialContentState)
    useEffect(() => {
        content.onStateChange(setState)
        content.load()
    }, [])

    useEffect(() => {
        switch (state.type) {
            case "succeed-to-load":
                document.title = `${documentTitle(state.path)} | ${document.title}`
                break
        }
    }, [state])

    switch (state.type) {
        case "initial-content":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return html`
                <header class="main__header">
                    <h1 class="main__title">${documentTitle(state.path)}</h1>
                    ${h(BreadcrumbList, components)}
                </header>
                <section class="main__body container">${contentBody(state.path)}</section>
            `
    }
}

function documentTitle(path: DocumentPath): string {
    switch (path) {
        case "/docs/index.html":
            return "ドキュメント"
    }
}
function contentBody(path: DocumentPath): VNode {
    switch (path) {
        case "/docs/index.html":
            return content_index()
    }
}

const EMPTY_CONTENT = html``
