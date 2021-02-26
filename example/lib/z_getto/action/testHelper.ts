export interface ActionTestRunner<S> {
    addTestCase(statement: AsyncActionTestStatement, examine: ExamineActionStateStack<S>): void
    run(done: ActionTestCheckDoneHook): ActionStateHandler<S>
}
export function initAsyncActionTestRunner<S>(hasDone: ActionHasDone<S>): ActionTestRunner<S> {
    const runner = initActionTestRunner<S>()
    return {
        addTestCase: runner.enqueue,
        run: (hook) => {
            const checkState = runner.run(hook)
            if (!checkState.testCaseExists) {
                return () => {
                    // テストケースが存在しない場合は何もしない state handler を返す
                }
            }
            const { checker } = checkState
            return (state) => {
                checker.pushState(state)

                // 非同期的なアクションの場合、完了状態に変更した時点で試験する
                if (hasDone(state)) {
                    checker.examine()
                }
            }
        },
    }
}
export function initSyncActionTestRunner<S>(): ActionTestRunner<S> {
    const runner = initActionTestRunner<S>()
    return {
        addTestCase: (statement, examine) => {
            runner.enqueue((check) => {
                if (statement.length > 0) {
                    // 同期的なテストだが、done 判定をテストケース側でやりたい
                    statement(check)
                    return
                }

                statement(() => {
                    // 型に合わせて引数を指定しているが、受け取られない
                })
                // 同期的なテストなので、ステートメント実行後にテストを行う
                check()
            }, examine)
        },
        run: (hook) => {
            const checkState = runner.run(hook)
            if (!checkState.testCaseExists) {
                return () => {
                    // テストケースが存在しない場合は何もしない state handler を返す
                }
            }
            return checkState.checker.pushState
        },
    }
}
interface ActionTestBasicRunner<S> {
    enqueue(statement: AsyncActionTestStatement, examine: ExamineActionStateStack<S>): void
    run(done: ActionTestCheckDoneHook): ActionTestCheckState<S>
}
type ActionTestCheckState<S> =
    | Readonly<{ testCaseExists: false }>
    | Readonly<{ testCaseExists: true; checker: ActionTestChecker<S> }>
interface ActionTestChecker<S> {
    pushState(state: S): void
    examine(): void
}
function initActionTestRunner<S>(): ActionTestBasicRunner<S> {
    let queue: AsyncActionTestInfo<S>[] = []

    return {
        enqueue,
        run,
    }

    function enqueue(statement: AsyncActionTestStatement, examine: ExamineActionStateStack<S>) {
        queue = [
            ...queue,
            {
                statement,
                examine,
            },
        ]
    }
    function run(done: ActionTestCheckDoneHook): ActionTestCheckState<S> {
        if (queue.length === 0) {
            done()
            return { testCaseExists: false }
        }

        let current = queue[0]
        queue = queue.slice(1)

        let stack: S[] = []

        // リソースを返してからステートメントを実行するための setTimeout
        setTimeout(() => {
            stack = []
            current.statement(examineCurrent)
        })

        return {
            testCaseExists: true,
            checker: {
                pushState,
                examine: examineCurrent,
            },
        }

        function pushState(state: S) {
            stack = [...stack, state]
        }
        function examineCurrent() {
            current.examine(stack)
            checkNext()
        }
        function checkNext() {
            if (queue.length === 0) {
                done()
                return
            }

            current = queue[0]
            queue = queue.slice(1)

            stack = []
            current.statement(examineCurrent)
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
export interface SyncActionTestStatement {
    (): void
    (hook: { (): void }): void
}
interface ActionTestCheckDoneHook {
    (): void
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

export interface SyncActionChecker_simple<S> {
    readonly handler: ActionStateHandler<S>
    check(examine: ExamineActionStateStack<S>): void
}
export function initSyncActionChecker_simple<S>(): SyncActionChecker_simple<S> {
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
