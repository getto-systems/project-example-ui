import { Find, FindCollector } from "../../../next_version/action"
import { NextVersionComponentFactory } from "../../next_version/component"
import { MoveToNextVersionComponentSet } from "../view"

export type MoveToNextVersionFactorySet = Readonly<{
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
export function initMoveToNextVersionComponentSet(
    factory: MoveToNextVersionFactorySet,
    collector: MoveToNextVersionCollectorSet
): MoveToNextVersionComponentSet {
    const actions = {
        find: factory.actions.nextVersion.find(collector.nextVersion),
    }
    return {
        nextVersion: factory.components.nextVersion(actions),
    }
}
