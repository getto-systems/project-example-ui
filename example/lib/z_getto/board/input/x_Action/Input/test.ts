import { initSyncActionTestRunner } from "../../../../application/testHelper"
import { standardBoardValueStore } from "./testHelper"

import { newInputBoardValueAction } from "./impl"

import { BoardValue, markBoardValue } from "../../../kernel/data"

describe("InputBoardValue", () => {
    test("get / set / clear; store linked", (done) => {
        const { action, store } = standardResource()

        const checker = initSyncActionTestRunner<BoardValue>()

        action.linkStore(store)

        checker.addTestCase(
            () => {
                action.set(markBoardValue("value"))
            },
            (stack) => {
                expect(stack).toEqual(["value"])
                expect(action.get()).toEqual("value")
            },
        )

        checker.addTestCase(
            () => {
                action.clear()
            },
            (stack) => {
                expect(stack).toEqual([""])
                expect(action.get()).toEqual("")
            },
        )

        const handler = checker.run(done)
        action.addInputHandler(() => handler(action.get()))
    })

    test("get / set / clear; no store linked", (done) => {
        const { action } = standardResource()

        const checker = initSyncActionTestRunner<BoardValue>()

        // no store linked
        // action.linkStore(store)

        checker.addTestCase(
            () => {
                action.set(markBoardValue("value"))
            },
            (stack) => {
                expect(stack).toEqual([])
                expect(action.get()).toEqual("")
            },
        )

        checker.addTestCase(
            () => {
                action.clear()
            },
            (stack) => {
                expect(stack).toEqual([])
                expect(action.get()).toEqual("")
            },
        )

        const handler = checker.run(done)
        action.addInputHandler(() => handler(action.get()))
    })
})

function standardResource() {
    const action = newInputBoardValueAction()
    const store = standardBoardValueStore()

    return { action, store }
}
