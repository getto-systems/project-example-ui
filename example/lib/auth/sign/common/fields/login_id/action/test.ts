import { initSyncActionTestRunner } from "../../../../../../z_vendor/getto-application/action/testHelper"
import { standardBoardValueStore } from "../../../../../../z_vendor/getto-application/board/input/Action/testHelper"

import { initInputLoginIDAction } from "./core/impl"

import { markBoardValue } from "../../../../../../z_vendor/getto-application/board/kernel/testHelper"

describe("InputLoginID", () => {
    test("validate; valid input", (done) => {
        const { action } = standardElements()

        const runner = initSyncActionTestRunner([
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
    })

    test("validate; invalid : empty", (done) => {
        const { action } = standardElements()

        const runner = initSyncActionTestRunner([
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
    })

    test("validate; invalid : too-long", (done) => {
        const { action } = standardElements()

        const runner = initSyncActionTestRunner([
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
    })

    test("validate; valid : just max-length", (done) => {
        const { action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // just max-length
                    action.board.input.set(markBoardValue("a".repeat(100)))
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: true }])
                    expect(action.validate.get()).toEqual({ valid: true, value: "a".repeat(100) })
                },
            },
        ])

        action.validate.subscriber.subscribe(runner(done))
    })

    test("clear", () => {
        const { action } = standardElements()

        action.board.input.set(markBoardValue("valid"))
        action.clear()

        expect(action.board.input.get()).toEqual("")
    })

    test("terminate", (done) => {
        const { action } = standardElements()

        const runner = initSyncActionTestRunner([
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
    })
})

function standardElements() {
    const action = initInputLoginIDAction()
    action.board.input.storeLinker.link(standardBoardValueStore())

    return { action }
}
