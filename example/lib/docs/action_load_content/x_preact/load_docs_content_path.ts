import { h, VNode } from "preact"
import { useState, useLayoutEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useDocumentTitle } from "../../../common/x_preact/hooks"
import { VNodeContent } from "../../../common/x_preact/design/common"
import { copyright } from "../../../common/x_preact/site"

import { LoadBreadcrumbListComponent } from "../../../outline/menu/action_load_breadcrumb_list/x_preact/load_breadcrumb_list"

import { LoadBreadcrumbListResource } from "../../../outline/menu/action_load_breadcrumb_list/resource"
import { LoadDocsContentPathResource } from "../resource"

import { DocsContentPath } from "../../load_content_path/data"

type Resource = LoadDocsContentPathResource & LoadBreadcrumbListResource
export function LoadDocsContentPathComponent(resource: Resource): VNode {
    const docsContentPath = resource.docsContentPath.load()
    const loadContentState = useDocsContent(docsContentPath)

    useDocumentTitle(documentTitle(docsContentPath))

    if (!loadContentState.loaded) {
        return EMPTY_CONTENT
    }
    return appMain({
        header: mainHeader([
            mainTitle(documentTitle(docsContentPath)),
            h(LoadBreadcrumbListComponent, resource),
        ]),
        body: mainBody(loadContentState.content),
        copyright: copyright(),
    })
}

type LoadContentState =
    | Readonly<{ loaded: false }>
    | Readonly<{ loaded: true; content: VNodeContent }>

const initialLoadContentState: LoadContentState = { loaded: false }

function useDocsContent(path: DocsContentPath): LoadContentState {
    const [state, setState] = useState(initialLoadContentState)
    useLayoutEffect(() => {
        loadContent(path, (content) => {
            setState({ loaded: true, content })
        })
    }, [])

    return state
}

function documentTitle(path: DocsContentPath): string {
    return findEntry(path).title
}
async function loadContent(path: DocsContentPath, post: Post<VNodeContent>) {
    post(await findEntry(path).content())
}
function findEntry(path: DocsContentPath): ContentEntry {
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
    (await import("../../../x_preact/docs/Docs/contents/home")).content_index(),
)
const contentMap: Record<DocsContentPath, ContentEntry> = {
    "/docs/index.html": indexEntry,
    "/docs/auth.html": entry("認証・認可", async () =>
        (await import("../../../x_preact/docs/Docs/contents/auth")).content_auth(),
    ),

    "/docs/z-dev/deployment.html": entry("配備構成", async () =>
        (
            await import("../../../x_preact/docs/Docs/contents/z_dev/deployment")
        ).content_development_deployment(),
    ),
    "/docs/z-dev/auth/login.html": entry("ログイン", async () =>
        (
            await import("../../../x_preact/docs/Docs/contents/z_dev/auth/login")
        ).content_development_auth_login(),
    ),
    "/docs/z-dev/auth/permission.html": entry("アクセス制限", async () =>
        (
            await import("../../../x_preact/docs/Docs/contents/z_dev/auth/permission")
        ).content_development_auth_permission(),
    ),
    "/docs/z-dev/auth/user.html": entry("ユーザー管理", async () =>
        (
            await import("../../../x_preact/docs/Docs/contents/z_dev/auth/user")
        ).content_development_auth_user(),
    ),
    "/docs/z-dev/auth/profile.html": entry("認証情報管理", async () =>
        (
            await import("../../../x_preact/docs/Docs/contents/z_dev/auth/profile")
        ).content_development_auth_profile(),
    ),
    "/docs/z-dev/auth/api.html": entry("API 詳細設計", async () =>
        (
            await import("../../../x_preact/docs/Docs/contents/z_dev/auth/api")
        ).content_development_auth_api(),
    ),
}

const EMPTY_CONTENT = html``

interface Post<T> {
    (state: T): void
}
interface ContentFactory<T> {
    (): Promise<T>
}
