import { mockLoadDocsContentPathLocationDetecter } from "../load_content_path/impl/mock"

import { initLoadDocsContentPathCoreAction } from "./core/impl"

describe("LoadDocsContentPath", () => {
    test("load content", () => {
        const { resource } = standard()

        expect(resource.docsContentPath.load()).toEqual("/docs/index.html")
    })
})

function standard() {
    const resource = initResource()

    return { resource }
}

function initResource() {
    const currentURL = standard_URL()
    const version = standard_version()
    const detecter = mockLoadDocsContentPathLocationDetecter(currentURL, version)
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
