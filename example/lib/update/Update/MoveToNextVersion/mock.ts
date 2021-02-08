import { MockComponent } from "../../../sub/getto-example/application/mock"

import { initMockNextVersionComponent } from "../nextVersion/mock"

import { MoveToNextVersionEntryPoint } from "./entryPoint"
import { initialNextVersionState, NextVersionState } from "../nextVersion/component"

export function newMockMoveToNextVersion(): MoveToNextVersionMockEntryPoint {
    const resource = {
        nextVersion: initMockNextVersionComponent(initialNextVersionState),
    }
    return {
        moveToNextVersion: {
            resource,
            terminate: () => {
                // mock では特に何もしない
            },
        },
        update: {
            nextVersion: update(resource.nextVersion),
        },
    }
}

export type MoveToNextVersionMockEntryPoint = Readonly<{
    moveToNextVersion: MoveToNextVersionEntryPoint
    update: Readonly<{
        nextVersion: Post<NextVersionState>
    }>
}>

function update<S, C extends MockComponent<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
