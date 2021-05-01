import { setupSyncActionTestRunner } from "../../../z_vendor/getto-application/action/test_helper_legacy"

import { markBoardValue } from "../../../z_vendor/getto-application/board/kernel/mock"
import { mockBoardValueStore } from "../../../z_vendor/getto-application/board/action_input/mock"

import { initInputLoginIDAction } from "./core/impl"

describe("InputLoginID", () => {
    test("validate; valid input", () =>
        new Promise<void>((done) => {
            const { action } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: () => {
                        // valid input
                        action.board.input.set(markBoardValue("valid"))
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([{ valid: true }])
                        expect(action.validate.get()).toEqual({ valid: true, value: "valid" })
                    },
                },
            ])

            action.validate.subscriber.subscribe(runner(done))
        }))

    test("validate; invalid : empty", () =>
        new Promise<void>((done) => {
            const { action } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: () => {
                        // empty
                        action.board.input.set(markBoardValue(""))
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([{ valid: false, err: [{ type: "empty" }] }])
                        expect(action.validate.get()).toEqual({
                            valid: false,
                            err: [{ type: "empty" }],
                        })
                    },
                },
            ])

            action.validate.subscriber.subscribe(runner(done))
        }))

    test("validate; invalid : too-long", () =>
        new Promise<void>((done) => {
            const { action } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: () => {
                        // too-long
                        action.board.input.set(markBoardValue("a".repeat(100 + 1)))
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            { valid: false, err: [{ type: "too-long", maxLength: 100 }] },
                        ])
                        expect(action.validate.get()).toEqual({
                            valid: false,
                            err: [{ type: "too-long", maxLength: 100 }],
                        })
                    },
                },
            ])

            action.validate.subscriber.subscribe(runner(done))
        }))

    test("validate; valid : just max-length", () =>
        new Promise<void>((done) => {
            const { action } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: () => {
                        // just max-length
                        action.board.input.set(markBoardValue("a".repeat(100)))
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([{ valid: true }])
                        expect(action.validate.get()).toEqual({
                            valid: true,
                            value: "a".repeat(100),
                        })
                    },
                },
            ])

            action.validate.subscriber.subscribe(runner(done))
        }))

    test("clear", () => {
        const { action } = standard()

        action.board.input.set(markBoardValue("valid"))
        action.clear()

        expect(action.board.input.get()).toEqual("")
    })

    test("terminate", () =>
        new Promise<void>((done) => {
            const { action } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: () => {
                        action.terminate()
                        action.board.input.set(markBoardValue("valid"))
                    },
                    examine: (stack) => {
                        // no input/validate event after terminate
                        expect(stack).toEqual([])
                    },
                },
            ])

            const handler = runner(done)
            action.board.input.subscribeInputEvent(() => handler(action.board.input.get()))
            action.validate.subscriber.subscribe(handler)
        }))
})

function standard() {
    const action = initInputLoginIDAction()
    action.board.input.storeLinker.link(mockBoardValueStore())

    return { action }
}
