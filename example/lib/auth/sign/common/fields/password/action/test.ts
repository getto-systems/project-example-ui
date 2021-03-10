import { initSyncActionTestRunner } from "../../../../../../z_vendor/getto-application/action/test_helper"

import { markBoardValue } from "../../../../../../z_vendor/getto-application/board/kernel/mock"
import { mockBoardValueStore } from "../../../../../../z_vendor/getto-application/board/action_input/mock"

import { initInputPasswordAction } from "./core/impl"

describe("InputPassword", () => {
    test("validate; valid input", (done) => {
        const { resource: action } = standardElements()

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
        const { resource: action } = standardElements()

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
        const { resource: action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // too-long
                    action.board.input.set(markBoardValue("a".repeat(72 + 1)))
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        {
                            valid: false,
                            err: [{ type: "too-long", maxBytes: 72, multiByte: false }],
                        },
                    ])
                    expect(action.validate.get()).toEqual({
                        valid: false,
                        err: [{ type: "too-long", maxBytes: 72, multiByte: false }],
                    })
                },
            },
        ])

        action.validate.subscriber.subscribe(runner(done))
    })

    test("validate; valid : just max-length", (done) => {
        const { resource: action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // just max-length
                    action.board.input.set(markBoardValue("a".repeat(72)))
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: true }])
                    expect(action.validate.get()).toEqual({ valid: true, value: "a".repeat(72) })
                },
            },
        ])

        action.validate.subscriber.subscribe(runner(done))
    })

    test("validate; invalid : too-long : multi-byte", (done) => {
        const { resource: action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // too-long : "あ"(UTF8) is 3 bytes character
                    action.board.input.set(markBoardValue("あ".repeat(24) + "a"))
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        {
                            valid: false,
                            err: [{ type: "too-long", maxBytes: 72, multiByte: true }],
                        },
                    ])
                    expect(action.validate.get()).toEqual({
                        valid: false,
                        err: [{ type: "too-long", maxBytes: 72, multiByte: true }],
                    })
                },
            },
        ])

        action.validate.subscriber.subscribe(runner(done))
    })

    test("validate; valid : just max-length : multi-byte", (done) => {
        const { resource: action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // just max-length : "あ"(UTF8) is 3 bytes character
                    action.board.input.set(markBoardValue("あ".repeat(24)))
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: true }])
                    expect(action.validate.get()).toEqual({ valid: true, value: "あ".repeat(24) })
                },
            },
        ])

        action.validate.subscriber.subscribe(runner(done))
    })

    test("password character state : single byte", () => {
        const { resource: action } = standardElements()

        action.board.input.set(markBoardValue("password"))

        expect(action.checkCharacter()).toEqual({ multiByte: false })
    })

    test("password character state : multi byte", () => {
        const { resource: action } = standardElements()

        action.board.input.set(markBoardValue("パスワード"))
        expect(action.checkCharacter()).toEqual({ multiByte: true })
    })

    test("clear", () => {
        const { resource: action } = standardElements()

        action.board.input.set(markBoardValue("valid"))
        action.clear()

        expect(action.board.input.get()).toEqual("")
    })

    test("terminate", (done) => {
        const { resource: action } = standardElements()

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
    const resource = initInputPasswordAction()
    resource.board.input.storeLinker.link(mockBoardValueStore())

    return { resource }
}
