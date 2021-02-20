import { initSyncActionChecker } from "../../../../application/testHelper"

import { newBoardValueStore } from "../../../input/infra/store"
import { newBoardValidateStack } from "../../../kernel/infra/stack"

import { initValidateBoardFieldAction } from "./impl"

import { ValidateBoardFieldAction, ValidateBoardFieldState } from "./action"

import { BoardConvertResult, markBoardValue } from "../../../kernel/data"

describe("ValidateBoard", () => {
    test("validate; valid input", () => {
        const { action, board, validateStack } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidateError>>()
        action.addStateHandler(checker.handler)

        // valid input
        board.set(markBoardValue("valid"))

        action.check()
        checker.check((stack) => {
            expect(stack).toEqual([{ valid: true }])
            expect(validateStack.get("field")).toEqual({ found: true, state: true })
            expect(action.get()).toEqual({ success: true, value: "valid" })
        })
    })

    test("validate; invalid input", () => {
        const { action, board, validateStack } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidateError>>()
        action.addStateHandler(checker.handler)

        // invalid input : see validator()
        board.set(markBoardValue(""))

        action.check()
        checker.check((stack) => {
            expect(stack).toEqual([{ valid: false, err: ["empty"] }])
            expect(validateStack.get("field")).toEqual({ found: true, state: false })
            expect(action.get()).toEqual({ success: false })
        })
    })
})

function standardResource() {
    const board = newBoardValueStore()
    const stack = newBoardValidateStack()

    const action: ValidateBoardFieldAction<
        FieldValue,
        ValidateError
    > = initValidateBoardFieldAction({ name: "field", converter, validator }, { stack })

    function converter(): BoardConvertResult<FieldValue> {
        return { success: true, value: board.get() }
    }
    function validator(): ValidateError[] {
        if (board.get() === "") {
            return ["empty"]
        }
        return []
    }

    return { board, validateStack: stack, action }
}

type FieldValue = string
type ValidateError = "empty"
