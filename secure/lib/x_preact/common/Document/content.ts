import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../layout"
import { BreadcrumbList } from "../System/breadcrumb"

import { content_index } from "./content/index"
import { content_server } from "./content/server"
import { content_detail_server } from "./content/detail/server"
import { content_auth } from "./content/auth"
import { content_detail_auth } from "./content/detail/auth"

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
    "/docs/server.html": entry("サーバー構成", content_server),
    "/docs/detail/server.html": entry("サーバー構成詳細", content_detail_server),
    "/docs/auth.html": entry("認証・認可", content_auth),
    "/docs/detail/auth.html": entry("認証・認可詳細", content_detail_auth),
}

const EMPTY_CONTENT = html``

interface Factory<T> {
    (): T
}
