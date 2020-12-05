import { Find, FindCollector } from "../../../next_version/action"
import { NextVersionComponentFactory } from "../../next_version/component"
import { MoveToNextVersionResource } from "../view"

export type MoveToNextVersionFactory = Readonly<{
    actions: Readonly<{
        nextVersion: Readonly<{
            find: Find
        }>
    }>
    components: Readonly<{
        nextVersion: NextVersionComponentFactory
    }>
}>
export type MoveToNextVersionCollectorSet = Readonly<{
    nextVersion: FindCollector
}>
export function initMoveToNextVersionResource(
    factory: MoveToNextVersionFactory,
    collector: MoveToNextVersionCollectorSet
): MoveToNextVersionResource {
    const actions = {
        find: factory.actions.nextVersion.find(collector.nextVersion),
    }
    return {
        nextVersion: factory.components.nextVersion(actions),
    }
}
