export interface ActionTester<S> {
    (examine: ExamineActionStateStack<S>): ActionStateHandler<S>
}
export function initAsyncActionTester<S>(hasDone: ActionHasDone<S>): ActionTester<S> {
    const stack: S[] = []

    return (examine) => (state) => {
        stack.push(state)

        if (hasDone(state)) {
            examine(stack)
        }
    }
}

export interface SyncActionChecker<S> {
    readonly handler: ActionStateHandler<S>
    done(): void
}
export function initSyncActionChecker<S>(
    examine: ExamineActionStateStack<S>
): SyncActionChecker<S> {
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

export interface ActionStateHandler<S> {
    (state: S): void
}
export interface ActionHasDone<S> {
    (state: S): boolean
}
export interface ExamineActionStateStack<S> {
    (stack: S[]): void
}
