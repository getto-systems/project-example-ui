import { initSyncActionTestRunner } from "../../../../../../z_vendor/getto-application/action/testHelper"
import { standardBoardValueStore } from "../../../../../../z_vendor/getto-application/board/input/Action/testHelper"

import { initInputLoginIDAction } from "./Core/impl"

import { markBoardValue } from "../../../../../../z_vendor/getto-application/board/kernel/data"

describe("InputLoginID", () => {
    test("validate; valid input", (done) => {
        const { action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // valid input
                    action.resource.input.set(markBoardValue("valid"))
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
                    action.resource.input.set(markBoardValue(""))
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: false, err: ["empty"] }])
                    expect(action.validate.get()).toEqual({ valid: false, err: ["empty"] })
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
                    action.resource.input.set(markBoardValue("a".repeat(100 + 1)))
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: false, err: ["too-long"] }])
                    expect(action.validate.get()).toEqual({ valid: false, err: ["too-long"] })
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
                    action.resource.input.set(markBoardValue("a".repeat(100)))
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

        action.resource.input.set(markBoardValue("valid"))
        action.clear()

        expect(action.resource.input.get()).toEqual("")
    })

    test("terminate", (done) => {
        const { action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    action.terminate()
                    action.resource.input.set(markBoardValue("valid"))
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        const handler = runner(done)
        action.resource.input.subscribeInputEvent(() => handler(action.resource.input.get()))
        action.validate.subscriber.subscribe(handler)
    })
})

function standardElements() {
    const action = initInputLoginIDAction()
    action.resource.input.storeLinker.link(standardBoardValueStore())

    return { action }
}
