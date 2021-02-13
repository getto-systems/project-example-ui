import { NotFoundFactory, initNotFoundResource } from "../../../../z_EntryPoint/NotFound/impl/core"

import { initCurrentVersionComponent } from "../impl"

import { initTestCurrentVersionAction } from "../../../../version/currentVersion/tests/currentVersion"

import { NotFoundResource } from "../../../../z_EntryPoint/NotFound/entryPoint"

export function newNotFoundTestResource(currentVersion: string): NotFoundResource {
    const factory: NotFoundFactory = {
        actions: {
            currentVersion: initTestCurrentVersionAction(currentVersion),
        },
        components: {
            currentVersion: initCurrentVersionComponent,
        },
    }
    return initNotFoundResource(factory)
}
