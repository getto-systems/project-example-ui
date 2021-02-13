import { NotFoundResource } from "../entryPoint"

import { CurrentVersionComponentFactory } from "../../../x_Resource/GetCurrentVersion/currentVersion/component"

import { FindCurrentVersionAction } from "../../../version/currentVersion/action"

export type NotFoundFactory = Readonly<{
    actions: Readonly<{
        currentVersion: FindCurrentVersionAction
    }>
    components: Readonly<{
        currentVersion: CurrentVersionComponentFactory
    }>
}>
export function initNotFoundResource(factory: NotFoundFactory): NotFoundResource {
    const actions = {
        findCurrentVersion: factory.actions.currentVersion.findCurrentVersion(),
    }
    return {
        currentVersion: factory.components.currentVersion(actions),
    }
}
