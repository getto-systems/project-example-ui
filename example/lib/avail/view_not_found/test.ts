import { initNotFoundEntryPoint } from "./impl"
import { initGetCurrentVersionResource } from "../version/action_get_current/impl"
import { initGetCurrentVersionCoreAction } from "../version/action_get_current/core/impl"

import { NotFoundEntryPoint } from "./entry_point"

describe("NotFound", () => {
    test("terminate", () => {
        const { entryPoint } = standard()

        // 特に何もしないのでテストすることもないが、カバレッジのために呼び出しておく
        entryPoint.terminate()
    })
})

function standard() {
    const entryPoint = initEntryPoint(standard_version())

    return { entryPoint }
}

function initEntryPoint(version: string): NotFoundEntryPoint {
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
