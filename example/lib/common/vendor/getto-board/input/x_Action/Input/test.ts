import { initSyncActionChecker } from "../../../../getto-example/Application/testHelper"

import { newBoard } from "../../../kernel/infra/board"

import { initInputBoardAction } from "./impl"

import { InputBoardState } from "./action"

import { markBoardValue } from "../../../kernel/data"

describe("InputBoard", () => {
    test("input and clear", () => {
        const { action } = standardResource()

        const checker = initSyncActionChecker<InputBoardState>()
        action.addStateHandler(checker.handler)

        action.set(markBoardValue("input"))
        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-input", value: "input" }])
            expect(action.get()).toEqual("input")
        })

        action.clear()
        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-input", value: "" }])
            expect(action.get()).toEqual("")
        })
    })
})

function standardResource() {
    const board = newBoard()

    const action = initInputBoardAction({ name: "input", type: "text" }, { board })

    return { board, action }
}
