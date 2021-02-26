import { initSyncActionTestRunner } from "../../../action/testHelper"
import { standardBoardValueStore } from "./testHelper"

import { initInputBoardValueAction } from "./Core/impl"

import { markBoardValue } from "../../kernel/data"

describe("InputBoardValue", () => {
    test("get / set / clear; store linked", (done) => {
        const { action, store } = standardResource()

        action.storeLinker.link(store)

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    action.set(markBoardValue("value"))
                },
                examine: (stack) => {
                    expect(stack).toEqual(["value"])
                },
            },
            {
                statement: () => {
                    action.clear()
                },
                examine: (stack) => {
                    expect(stack).toEqual([""])
                },
            },
        ])

        const handler = runner(done)
        action.subscribeInputEvent(() => handler(action.get()))
    })

    test("get / set / clear; no store linked", (done) => {
        const { action } = standardResource()

        // no linked store

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    action.set(markBoardValue("value"))
                },
                examine: (stack) => {
                    // event triggered, got empty value
                    expect(stack).toEqual([""])
                },
            },
        ])

        const handler = runner(done)
        action.subscribeInputEvent(() => handler(action.get()))
    })

    test("terminate", (done) => {
        const { action, store } = standardResource()

        action.storeLinker.link(store)

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    action.terminate()
                    action.set(markBoardValue("value"))
                },
                examine: (stack) => {
                    // no event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        const handler = runner(done)
        action.subscribeInputEvent(() => handler(action.get()))
    })
})

function standardResource() {
    const action = initInputBoardValueAction()
    const store = standardBoardValueStore()

    return { action, store }
}
