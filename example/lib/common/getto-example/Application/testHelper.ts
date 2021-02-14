export interface ComponentTester<S> {
    (examine: ExamineComponentStateStack<S>): ComponentStateHandler<S>
}
export function initAsyncComponentStateTester<S>(hasDone: ComponentStateHasDone<S>): ComponentTester<S> {
    const stack: S[] = []

    return (examine) => (state) => {
        stack.push(state)

        if (hasDone(state)) {
            examine(stack)
        }
    }
}

export interface SyncComponentTestChecker<S> {
    readonly handler: ComponentStateHandler<S>
    done(): void
}
export function initSyncComponentTestChecker<S>(
    examine: ExamineComponentStateStack<S>
): SyncComponentTestChecker<S> {
    const stack: S[] = []
    return {
        handler: (state: S) => {
            stack.push(state)
        },
        done: () => {
            examine(stack)
        },
    }
}

export interface ComponentStateHandler<S> {
    (state: S): void
}
export interface ComponentStateHasDone<S> {
    (state: S): boolean
}
export interface ExamineComponentStateStack<S> {
    (stack: S[]): void
}
