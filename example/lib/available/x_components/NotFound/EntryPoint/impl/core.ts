import { NotFoundResource } from "../entryPoint"

import { CurrentVersionComponentFactory } from "../../currentVersion/component"

import { FindCurrentVersionAction } from "../../../../currentVersion/action"

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
