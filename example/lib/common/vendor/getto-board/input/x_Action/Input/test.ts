import { initSyncActionChecker } from "../../../../getto-example/Application/testHelper"

import { newBoard } from "../../../kernel/infra/board"

import { initInputBoardAction } from "./impl"

import { InputBoardResource, InputBoardState } from "./action"

import { markBoardValue } from "../../../kernel/data"

describe("InputBoard", () => {
    test("input and clear", () => {
        const { resource, board } = standardResource()

        const checker = initSyncActionChecker<InputBoardState>()
        resource.input.addStateHandler(checker.handler)

        resource.input.set(markBoardValue("input"))
        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-input", value: "input" }])
            expect(board.get("input")).toEqual("input")
        })

        resource.input.clear()
        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-input", value: "" }])
            expect(board.get("input")).toEqual("")
        })
    })
})

function standardResource() {
    const board = newBoard()

    const resource: InputBoardResource = {
        input: initInputBoardAction({ input: { board, name: "input" } }),
    }

    return { board, resource }
}
