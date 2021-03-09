import { LoadDocsContentPathCoreAction } from "./action"

import { DocsContentPath } from "../../load_content_path/data"

export function mockLoadDocsContentPathCoreAction(
    path: DocsContentPath,
): LoadDocsContentPathCoreAction {
    return {
        load: () => path,
    }
}
