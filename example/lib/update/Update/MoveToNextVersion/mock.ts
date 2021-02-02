import { MockComponent } from "../../../sub/getto-example/application/mock"

import { initNextVersionComponent } from "../nextVersion/mock"

import { MoveToNextVersionEntryPoint } from "./view"
import { initialNextVersionState, NextVersionState } from "../nextVersion/component"

export function newMoveToNextVersion(): MoveToNextVersionMockEntryPoint {
    const resource = {
        nextVersion: initNextVersionComponent(initialNextVersionState),
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
