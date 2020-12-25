import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../common/layout"
import { BreadcrumbList } from "../Outline/BreadcrumbList"

import { content_index } from "./contents/home"
import { content_auth } from "./contents/auth"
import { content_development_deployment } from "./contents/development/deployment"
import { content_development_auth_login } from "./contents/development/auth/login"
import { content_development_auth_role } from "./contents/development/auth/role"
import { content_development_auth_user } from "./contents/development/auth/user"
import { content_development_auth_profile } from "./contents/development/auth/profile"
import { content_development_auth_api } from "./contents/development/auth/api"

import { ContentComponent, initialContentState } from "../../../document/Document/content/component"
import { BreadcrumbListComponent } from "../../../example/Outline/breadcrumbList/component"

import { ContentPath } from "../../../document/content/data"

type Props = Readonly<{
    content: ContentComponent
    breadcrumb: BreadcrumbListComponent
}>
export function Content(resource: Props): VNode {
    const content = resource.content

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
                    ${h(BreadcrumbList, resource)}
                </header>
                <section class="main__body">${contentBody(state.path)}</section>
            `
    }
}

function documentTitle(path: ContentPath): string {
    return findEntry(path).title
}
function contentBody(path: ContentPath): VNodeContent {
    return findEntry(path).content()
}
function findEntry(path: ContentPath): ContentEntry {
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
const contentMap: Record<ContentPath, ContentEntry> = {
    "/docs/index.html": indexEntry,
    "/docs/auth.html": entry("認証・認可", content_auth),

    "/docs/development/deployment.html": entry("配備構成", content_development_deployment),
    "/docs/development/auth/login.html": entry("ログイン", content_development_auth_login),
    "/docs/development/auth/role.html": entry("アクセス制限", content_development_auth_role),
    "/docs/development/auth/user.html": entry("ユーザー管理", content_development_auth_user),
    "/docs/development/auth/profile.html": entry("認証情報管理", content_development_auth_profile),
    "/docs/development/auth/api.html": entry("API 詳細設計", content_development_auth_api),
}

const EMPTY_CONTENT = html``

interface Factory<T> {
    (): T
}
