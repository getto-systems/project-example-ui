export interface AsyncActionChecker<S> {
    (done: { (): void }): {
        readonly handler: ActionStateHandler<S>
        check: { (statement: AsyncActionTestStatement, examine: ExamineActionStateStack<S>): void }
    }
}
export function initAsyncActionChecker<S>(hasDone: ActionHasDone<S>): AsyncActionChecker<S> {
    let stack: S[] = []

    let queue: AsyncActionTestInfo<S>[] = []
    let current: AsyncActionTestInfo<S> | null = null

    return (hook) => {
        return {
            handler: (state: S) => {
                stack = [...stack, state]

                if (hasDone(state)) {
                    checkCurrent()
                }
            },
            check(statement, examine) {
                queue = [...queue, { statement, examine }]

                if (!current) {
                    checkNext()
                }
            },
        }

        function checkCurrent() {
            if (current) {
                current.examine(stack)
            }
            stack = []
            checkNext()
        }
        function checkNext() {
            if (queue.length === 0) {
                hook()
                return
            }
            current = queue[0]
            queue = queue.slice(1)

            current.statement(checkCurrent)
        }
    }
}
export type AsyncActionTestInfo<S> = Readonly<{
    statement: AsyncActionTestStatement
    examine: ExamineActionStateStack<S>
}>
export interface AsyncActionTestStatement {
    (hook: { (): void }): void
}

export interface ActionTester_legacy<S> {
    (examine: ExamineActionStateStack<S>): ActionStateHandler<S>
}
export function initAsyncActionTester_legacy<S>(hasDone: ActionHasDone<S>): ActionTester_legacy<S> {
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
