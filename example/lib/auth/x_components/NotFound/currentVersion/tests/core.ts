import { NotFoundFactory, initNotFoundResource } from "../../EntryPoint/impl/core"

import { initCurrentVersionComponent } from "../impl"

import { initTestCurrentVersionAction } from "../../../../permission/currentVersion/tests/currentVersion"

import { NotFoundResource } from "../../EntryPoint/entryPoint"

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
