import { initSyncActionTestRunner } from "../../../../application/testHelper"
import { standardBoardValueStore } from "./testHelper"

import { newInputBoardValueAction } from "./impl"

import { BoardValue, markBoardValue } from "../../../kernel/data"

describe("InputBoardValue", () => {
    test("get / set / clear; store linked", (done) => {
        const { action, store } = standardResource()

        action.linkStore(store)

        const checker = initSyncActionTestRunner<BoardValue>()

        checker.addTestCase(
            () => {
                action.set(markBoardValue("value"))
            },
            (stack) => {
                expect(stack).toEqual(["value"])
            },
        )

        checker.addTestCase(
            () => {
                action.clear()
            },
            (stack) => {
                expect(stack).toEqual([""])
            },
        )

        const handler = checker.run(done)
        action.subscribeInputEvent(() => handler(action.get()))
    })

    test("get / set / clear; no store linked", (done) => {
        const { action } = standardResource()

        // no linked store

        const checker = initSyncActionTestRunner<BoardValue>()

        checker.addTestCase(
            () => {
                action.set(markBoardValue("value"))
            },
            (stack) => {
                // event triggered, got empty value
                expect(stack).toEqual([""])
            },
        )

        const handler = checker.run(done)
        action.subscribeInputEvent(() => handler(action.get()))
    })

    test("terminate", (done) => {
        const { action, store } = standardResource()

        action.linkStore(store)

        const checker = initSyncActionTestRunner<BoardValue>()

        checker.addTestCase(
            () => {
                action.terminate()
                action.set(markBoardValue("value"))
            },
            (stack) => {
                // no event after terminate
                expect(stack).toEqual([])
            },
        )

        const handler = checker.run(done)
        action.subscribeInputEvent(() => handler(action.get()))
    })
})

function standardResource() {
    const action = newInputBoardValueAction()
    const store = standardBoardValueStore()

    return { action, store }
}
