import { NotFoundFactory, initNotFoundResource } from "../impl/core"

import { initCurrentVersionComponent } from "../../currentVersion/impl"

import { NotFoundEntryPoint } from "../entryPoint"

import { initCurrentVersionAction } from "../../../../permission/currentVersion/main/currentVersion"

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
