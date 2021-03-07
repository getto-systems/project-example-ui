import { initGetCurrentVersionCoreAction } from "./Core/impl"
import { initGetCurrentVersionResource } from "./impl"

import { GetCurrentVersionResource } from "./resource"

describe("GetCurrentVersion", () => {
    test("load current version", () => {
        const { resource } = standard_elements()

        expect(resource.version.getCurrent()).toEqual("1.0.0")
    })
})

function standard_elements() {
    const resource = newResource(standard_version())

    return { resource }
}

function newResource(version: string): GetCurrentVersionResource {
    return initGetCurrentVersionResource(
        initGetCurrentVersionCoreAction({
            version,
        }),
    )
}

function standard_version(): string {
    return "1.0.0"
}
