import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { BreadcrumbList } from "../../system/breadcrumb"

import { DocumentComponentSet } from "../../../Document/document/view"
import { initialContentState } from "../../../Document/component/content/component"
import { DocumentPath } from "../../../content/data"

import { content_index } from "./content/index"
import { content_server } from "./content/server"
import { content_detail_server } from "./content/detail/server"
import { content_auth } from "./content/auth"
import { content_detail_auth } from "./content/detail/auth"

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
        case "/docs/server.html":
            return "サーバー構成"
        case "/docs/detail/server.html":
            return "サーバー構成詳細"
        case "/docs/auth.html":
            return "認証・認可"
        case "/docs/detail/auth.html":
            return "認証・認可詳細"
    }
}
function contentBody(path: DocumentPath): VNode {
    switch (path) {
        case "/docs/index.html":
            return content_index()
        case "/docs/server.html":
            return content_server()
        case "/docs/detail/server.html":
            return content_detail_server()
        case "/docs/auth.html":
            return content_auth()
        case "/docs/detail/auth.html":
            return content_detail_auth()
    }
}

const EMPTY_CONTENT = html``
