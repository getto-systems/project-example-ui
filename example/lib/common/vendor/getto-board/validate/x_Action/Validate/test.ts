import { initSyncActionChecker } from "../../../../getto-example/Application/testHelper"

import { newBoard } from "../../../kernel/infra/board"
import { newBoardValidateStack } from "../../../kernel/infra/stack"

import { initValidateBoardAction } from "./impl"

import { ValidateBoardAction, ValidateBoardState } from "./action"

import { markBoardValue } from "../../../kernel/data"
import { BoardConvertResult } from "../../data"

describe("ValidateBoard", () => {
    test("validate; valid input", () => {
        const { action, board, validateStack } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidateError>>()
        action.addStateHandler(checker.handler)

        // valid input
        board.set("input", markBoardValue("valid"))

        action.check()
        checker.check((stack) => {
            expect(stack).toEqual([{ valid: true }])
            expect(validateStack.get("field")).toEqual({ found: true, state: true })
            expect(action.get()).toEqual({ success: true, value: "valid" })
        })
    })

    test("validate; invalid input", () => {
        const { action, board, validateStack } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidateError>>()
        action.addStateHandler(checker.handler)

        // invalid input : see validator()
        board.set("input", markBoardValue(""))

        action.check()
        checker.check((stack) => {
            expect(stack).toEqual([{ valid: false, err: ["empty"] }])
            expect(validateStack.get("field")).toEqual({ found: true, state: false })
            expect(action.get()).toEqual({ success: false })
        })
    })
})

function standardResource() {
    const board = newBoard()
    const stack = newBoardValidateStack()

    const action: ValidateBoardAction<FieldValue, ValidateError> = initValidateBoardAction(
        { name: "field", converter, validator },
        { stack }
    )

    function converter(): BoardConvertResult<FieldValue> {
        return { success: true, value: board.get("input") }
    }
    function validator(): ValidateError[] {
        if (board.get("input") === "") {
            return ["empty"]
        }
        return []
    }

    return { board, validateStack: stack, action }
}

type FieldValue = string
type ValidateError = "empty"
