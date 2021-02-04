import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../z_vendor/getto-css/preact/common"
import { appMain, mainBody, mainHeader, mainTitle } from "../../z_vendor/getto-css/preact/layout/app"

import { copyright } from "../common/site"

import { BreadcrumbList } from "../Outline/BreadcrumbList"

import { ContentComponent, initialContentState } from "../../document/Document/content/component"
import { BreadcrumbListComponent } from "../../auth/Outline/breadcrumbList/component"

import { ContentPath } from "../../document/content/data"

type Props = Readonly<{
    content: ContentComponent
    breadcrumbList: BreadcrumbListComponent
}>
export function Content(resource: Props): VNode {
    const content = resource.content

    const [state, setState] = useState(initialContentState)
    const [loadContentState, setLoadContentState] = useState(initialLoadContentState)
    useEffect(() => {
        content.addStateHandler(setState)
        content.load()
    }, [])

    useEffect(() => {
        switch (state.type) {
            case "succeed-to-load":
                document.title = `${documentTitle(state.path)} | ${document.title}`
                loadContent(state.path, (content) => {
                    setLoadContentState({ loaded: true, content })
                })
                break
        }
    }, [state])

    switch (state.type) {
        case "initial-content":
            return EMPTY_CONTENT

        case "succeed-to-load":
            if (!loadContentState.loaded) {
                return EMPTY_CONTENT
            }
            return appMain({
                header: mainHeader([mainTitle(documentTitle(state.path)), h(BreadcrumbList, resource)]),
                body: mainBody(loadContentState.content),
                copyright: copyright(),
            })
    }
}

type LoadContentState = Readonly<{ loaded: false }> | Readonly<{ loaded: true; content: VNodeContent }>
const initialLoadContentState: LoadContentState = { loaded: false }

function documentTitle(path: ContentPath): string {
    return findEntry(path).title
}
async function loadContent(path: ContentPath, post: Post<VNodeContent>) {
    post(await findEntry(path).content())
}
function findEntry(path: ContentPath): ContentEntry {
    const entry = contentMap[path]
    if (!entry) {
        return indexEntry
    }
    return entry
}

type ContentEntry = Readonly<{ title: string; content: ContentFactory<VNodeContent> }>
function entry(title: string, content: ContentFactory<VNodeContent>): ContentEntry {
    return { title, content }
}

const indexEntry: ContentEntry = entry("ドキュメント", async () =>
    (await import("./contents/home")).content_index()
)
const contentMap: Record<ContentPath, ContentEntry> = {
    "/docs/index.html": indexEntry,
    "/docs/auth.html": entry("認証・認可", async () => (await import("./contents/auth")).content_auth()),

    "/docs/development/deployment.html": entry("配備構成", async () =>
        (await import("./contents/development/deployment")).content_development_deployment()
    ),
    "/docs/development/auth/login.html": entry("ログイン", async () =>
        (await import("./contents/development/auth/login")).content_development_auth_login()
    ),
    "/docs/development/auth/permission.html": entry("アクセス制限", async () =>
        (await import("./contents/development/auth/permission")).content_development_auth_permission()
    ),
    "/docs/development/auth/user.html": entry("ユーザー管理", async () =>
        (await import("./contents/development/auth/user")).content_development_auth_user()
    ),
    "/docs/development/auth/profile.html": entry("認証情報管理", async () =>
        (await import("./contents/development/auth/profile")).content_development_auth_profile()
    ),
    "/docs/development/auth/api.html": entry("API 詳細設計", async () =>
        (await import("./contents/development/auth/api")).content_development_auth_api()
    ),
}

const EMPTY_CONTENT = html``

interface Post<T> {
    (state: T): void
}
interface ContentFactory<T> {
    (): Promise<T>
}
