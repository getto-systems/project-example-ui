import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../layout"
import { BreadcrumbList } from "../Outline/BreadcrumbList"

import { content_index } from "./contents/index"
import { content_development_deployment } from "./contents/development/deployment"
import { content_development_auth } from "./contents/development/auth"

import { DocumentComponentSet } from "../../../common/Document/Document/view"
import { initialContentState } from "../../../common/Document/content/component"
import { DocumentPath } from "../../../common/content/data"

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
                <section class="main__body">${contentBody(state.path)}</section>
            `
    }
}

function documentTitle(path: DocumentPath): string {
    return findEntry(path).title
}
function contentBody(path: DocumentPath): VNodeContent {
    return findEntry(path).content()
}
function findEntry(path: DocumentPath): ContentEntry {
    const entry = contentMap[path]
    if (!entry) {
        return indexEntry
    }
    return entry
}

type ContentEntry = Readonly<{ title: string; content: Factory<VNodeContent> }>
function entry(title: string, content: Factory<VNodeContent>): ContentEntry {
    return { title, content }
}

const indexEntry: ContentEntry = entry("ドキュメント", content_index)
const contentMap: Record<DocumentPath, ContentEntry> = {
    "/docs/index.html": indexEntry,
    "/docs/development/deployment.html": entry("配備構成", content_development_deployment),
    "/docs/development/auth.html": entry("認証・認可", content_development_auth),
}

const EMPTY_CONTENT = html``

interface Factory<T> {
    (): T
}
