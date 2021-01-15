import { NotFoundResource } from "../view"

import { CurrentVersionComponentFactory } from "../../currentVersion/component"

import { CurrentVersionAction } from "../../../shared/currentVersion/action"

export type NotFoundFactory = Readonly<{
    actions: Readonly<{
        currentVersion: CurrentVersionAction
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
