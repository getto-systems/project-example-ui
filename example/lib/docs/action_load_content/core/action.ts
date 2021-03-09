import { LoadDocsContentPathMethod } from "../../load_content_path/method"

import { DocsContentPath } from "../../load_content_path/data"

export interface LoadDocsContentPathCoreAction {
    load(): DocsContentPath
}

export type LoadDocsContentPathCoreMaterial = Readonly<{
    load: LoadDocsContentPathMethod
}>
