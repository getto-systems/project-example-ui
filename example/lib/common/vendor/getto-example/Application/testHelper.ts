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
    check(examine: ExamineActionStateStack<S>): void
}
export function initSyncActionChecker<S>(): SyncActionChecker<S> {
    let stack: S[] = []
    return {
        handler: (state: S) => {
            stack = [...stack, state]
        },
        check: (examine) => {
            examine(stack)
            stack = []
        },
    }
}

export interface SyncActionChecker_legacy<S> {
    readonly handler: ActionStateHandler<S>
    done(): void
}
export function initSyncActionChecker_legacy<S>(
    examine: ExamineActionStateStack<S>
): SyncActionChecker_legacy<S> {
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
