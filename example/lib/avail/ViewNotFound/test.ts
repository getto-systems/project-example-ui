import { initNotFoundEntryPoint } from "./impl"
import { initGetCurrentVersionResource } from "../version/getCurrent/Action/impl"
import { initGetCurrentVersionCoreAction } from "../version/getCurrent/Action/Core/impl"

import { NotFoundEntryPoint } from "./entryPoint"

describe("NotFound", () => {
    test("terminate", () => {
        const { entryPoint } = standard_elements()

        // 特に何もしないのでテストすることもないが、カバレッジのために呼び出しておく
        entryPoint.terminate()
    })
})

function standard_elements() {
    const entryPoint = newEntryPoint(standard_version())

    return { entryPoint }
}

function newEntryPoint(version: string): NotFoundEntryPoint {
    return initNotFoundEntryPoint(
        initGetCurrentVersionResource(
            initGetCurrentVersionCoreAction({
                version,
            }),
        ),
    )
}

function standard_version(): string {
    return "1.0.0"
}
