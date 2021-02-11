import { env } from "../../../../../y_environment/env"

import { NotFoundFactory, initNotFoundResource } from "../impl/core"

import { initCurrentVersionComponent } from "../../currentVersion/impl"

import { findCurrentVersion } from "../../../../permission/currentVersion/impl/core"

import { NotFoundEntryPoint } from "../entryPoint"

import { CurrentVersionAction } from "../../../../permission/currentVersion/action"

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

function initCurrentVersionAction(): CurrentVersionAction {
    return {
        findCurrentVersion: findCurrentVersion({
            currentVersion: env.version,
        }),
    }
}
