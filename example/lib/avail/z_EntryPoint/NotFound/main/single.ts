import { NotFoundFactory, initNotFoundResource } from "../impl/core"

import { initCurrentVersionComponent } from "../../../x_Resource/GetCurrentVersion/currentVersion/impl"

import { NotFoundEntryPoint } from "../entryPoint"

import { initCurrentVersionAction } from "../../../version/local/main/currentVersion"

export function newNotFoundAsSingle(): NotFoundEntryPoint {
    const factory: NotFoundFactory = {
        actions: {
            currentVersion: initCurrentVersionAction(),
        },
        components: {
            currentVersion: initCurrentVersionComponent,
        },
    }
    const resource = initNotFoundResource(factory)
    return {
        resource,
        terminate: () => {
            resource.currentVersion.terminate()
        },
    }
}
