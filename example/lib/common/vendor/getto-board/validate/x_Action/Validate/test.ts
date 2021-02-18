import { initSyncActionChecker } from "../../../../getto-example/Application/testHelper"

import { newBoard } from "../../../kernel/infra/board"
import { newBoardValidateStack } from "../../../kernel/infra/stack"

import { initValidateBoardAction } from "./impl"

import { Board } from "../../../kernel/infra"

import { ValidateBoardResource, ValidateBoardState } from "./action"

import { markBoardValue } from "../../../kernel/data"

describe("ValidateBoard", () => {
    test("validate; valid input", () => {
        const { resource, board, validateStack } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidateError>>()
        resource.validate.addStateHandler(checker.handler)

        // valid input
        board.set("input", markBoardValue("valid"))

        resource.validate.check()
        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-validate", result: { success: true } }])
            expect(validateStack.get("field")).toEqual({ found: true, state: true })
        })
    })

    test("validate; invalid input", () => {
        const { resource, board, validateStack } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidateError>>()
        resource.validate.addStateHandler(checker.handler)

        // invalid input : see validator()
        board.set("input", markBoardValue(""))

        resource.validate.check()
        checker.check((stack) => {
            expect(stack).toEqual([
                { type: "succeed-to-validate", result: { success: false, err: ["empty"] } },
            ])
            expect(validateStack.get("field")).toEqual({ found: true, state: false })
        })
    })
})

function standardResource() {
    const board = newBoard()
    const stack = newBoardValidateStack()

    const resource: ValidateBoardResource<ValidateError> = {
        validate: initValidateBoardAction({ name: "field", validator }, { board, stack }),
    }

    return { board, validateStack: stack, resource }
}

type ValidateError = "empty"

function validator(board: Board): ValidateError[] {
    if (board.get("input") === "") {
        return ["empty"]
    }
    return []
}
