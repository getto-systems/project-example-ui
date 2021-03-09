import { initLoadDocsContentPathLocationDetecter } from "../load_content_path/impl/test_helper"

import { initLoadDocsContentPathCoreAction } from "./core/impl"

describe("LoadDocsContentPath", () => {
    test("load content", () => {
        const { resource } = standard_elements()

        expect(resource.docsContentPath.load()).toEqual("/docs/index.html")
    })
})

function standard_elements() {
    const resource = newResource()

    return { resource }
}

function newResource() {
    const currentURL = standard_URL()
    const version = standard_version()
    const detecter = initLoadDocsContentPathLocationDetecter(currentURL, version)
    return {
        docsContentPath: initLoadDocsContentPathCoreAction(detecter),
    }
}

function standard_version(): string {
    return "1.0.0"
}

function standard_URL(): URL {
    return new URL("https://example.com/1.0.0/docs/index.html")
}
