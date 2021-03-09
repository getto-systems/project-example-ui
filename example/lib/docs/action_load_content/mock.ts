import { mockLoadDocsContentPathCoreAction } from "./core/mock"

import { LoadDocsContentPathResource } from "./resource"

import { homeDocsContentPath } from "../load_content_path/data"

export function mockLoadDocsContentPathResource(): LoadDocsContentPathResource {
    return {
        docsContentPath: mockLoadDocsContentPathCoreAction(homeDocsContentPath),
    }
}
