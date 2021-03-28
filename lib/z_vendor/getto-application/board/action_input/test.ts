import { setupSyncActionTestRunner } from "../../action/test_helper"

import { mockBoardValueStore } from "./mock"
import { markBoardValue } from "../kernel/mock"

import { initInputBoardValueAction } from "./core/impl"

describe("InputBoardValue", () => {
    test("get / set / clear; store linked", () =>
        new Promise<void>((done) => {
            const { action, store } = standard()

            action.storeLinker.link(store)

            const runner = setupSyncActionTestRunner([
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
        }))

    test("get / set / clear; no store linked", () =>
        new Promise<void>((done) => {
            const { action } = standard()

            // no linked store

            const runner = setupSyncActionTestRunner([
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
        }))

    test("terminate", () =>
        new Promise<void>((done) => {
            const { action, store } = standard()

            action.storeLinker.link(store)

            const runner = setupSyncActionTestRunner([
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
        }))
})

function standard() {
    const action = initInputBoardValueAction()
    const store = mockBoardValueStore()

    return { action, store }
}
