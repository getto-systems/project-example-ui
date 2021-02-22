import { h, VNode } from "preact"
import { useState, useLayoutEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../../z_vendor/getto-css/preact/common"
import {
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { copyright } from "../../common/site"

import { BreadcrumbList } from "../../common/Outline/BreadcrumbList"

import {
    ContentComponent,
    initialContentComponentState,
} from "../../../docs/x_components/Docs/content/component"
import { BreadcrumbListComponent } from "../../../common/x_Resource/Outline/Menu/BreadcrumbList/component"

import { ContentPath } from "../../../docs/content/data"
import { useApplicationAction } from "../../common/hooks"

type Props = Readonly<{
    content: ContentComponent
    breadcrumbList: BreadcrumbListComponent
}>
export function Content(resource: Props): VNode {
    const state = useApplicationAction(resource.content, initialContentComponentState)
    const [loadContentState, setLoadContentState] = useState(initialLoadContentState)

    useLayoutEffect(() => {
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
                header: mainHeader([
                    mainTitle(documentTitle(state.path)),
                    h(BreadcrumbList, resource),
                ]),
                body: mainBody(loadContentState.content),
                copyright: copyright(),
            })
    }
}

type LoadContentState =
    | Readonly<{ loaded: false }>
    | Readonly<{ loaded: true; content: VNodeContent }>
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
    (await import("./contents/home")).content_index(),
)
const contentMap: Record<ContentPath, ContentEntry> = {
    "/docs/index.html": indexEntry,
    "/docs/auth.html": entry("認証・認可", async () =>
        (await import("./contents/auth")).content_auth(),
    ),

    "/docs/z_dev/deployment.html": entry("配備構成", async () =>
        (await import("./contents/z_dev/deployment")).content_development_deployment(),
    ),
    "/docs/z_dev/auth/login.html": entry("ログイン", async () =>
        (await import("./contents/z_dev/auth/login")).content_development_auth_login(),
    ),
    "/docs/z_dev/auth/permission.html": entry("アクセス制限", async () =>
        (
            await import("./contents/z_dev/auth/permission")
        ).content_development_auth_permission(),
    ),
    "/docs/z_dev/auth/user.html": entry("ユーザー管理", async () =>
        (await import("./contents/z_dev/auth/user")).content_development_auth_user(),
    ),
    "/docs/z_dev/auth/profile.html": entry("認証情報管理", async () =>
        (await import("./contents/z_dev/auth/profile")).content_development_auth_profile(),
    ),
    "/docs/z_dev/auth/api.html": entry("API 詳細設計", async () =>
        (await import("./contents/z_dev/auth/api")).content_development_auth_api(),
    ),
}

const EMPTY_CONTENT = html``

interface Post<T> {
    (state: T): void
}
interface ContentFactory<T> {
    (): Promise<T>
}