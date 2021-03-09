import { loadDocsContentPath } from "../../load_content_path/impl/core"

import { LoadDocsContentPathCoreAction } from "./action"

import { LoadDocsContentPathLocationDetecter } from "../../load_content_path/method"

export function initLoadDocsContentPathCoreAction(
    detecter: LoadDocsContentPathLocationDetecter,
): LoadDocsContentPathCoreAction {
    return {
        load: loadDocsContentPath(detecter),
    }
}
