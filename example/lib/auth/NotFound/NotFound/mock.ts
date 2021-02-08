import { MockComponent } from "../../../sub/getto-example/application/mock"

import { initMockCurrentVersionComponent } from "../currentVersion/mock"

import { NotFoundEntryPoint } from "./entryPoint"

import { CurrentVersionState, initialCurrentVersionState } from "../currentVersion/component"

export function newMockNotFound(): NotFoundMockEntryPoint {
    const resource = {
        currentVersion: initMockCurrentVersionComponent(initialCurrentVersionState),
    }
    return {
        notFound: {
            resource,
            terminate: () => {
                // mock では特に何もしない
            },
        },
        update: {
            currentVersion: update(resource.currentVersion),
        },
    }
}

export type NotFoundMockEntryPoint = Readonly<{
    notFound: NotFoundEntryPoint
    update: Readonly<{
        currentVersion: Post<CurrentVersionState>
    }>
}>

function update<S, C extends MockComponent<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
