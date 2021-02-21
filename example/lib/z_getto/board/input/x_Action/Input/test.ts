import { initSyncActionChecker_simple } from "../../../../application/testHelper"

import { newInputBoardValueAction } from "./impl"

import { InputBoardValueState } from "./action"

import { markBoardValue } from "../../../kernel/data"

describe("InputBoardValue", () => {
    test("input and clear", () => {
        const { action } = standardResource()

        const checker = initSyncActionChecker_simple<InputBoardValueState>()
        action.addStateHandler(checker.handler)

        action.set(markBoardValue("input"))
        checker.check((stack) => {
            expect(stack).toEqual(["input"])
            expect(action.get()).toEqual("input")
        })

        action.clear()
        checker.check((stack) => {
            expect(stack).toEqual([""])
            expect(action.get()).toEqual("")
        })
    })
})

function standardResource() {
    const action = newInputBoardValueAction()

    return { action }
}
