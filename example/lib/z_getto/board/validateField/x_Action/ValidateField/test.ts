import { initSyncActionTestRunner } from "../../../../application/testHelper"
import { standardBoardValueStore } from "../../../input/x_Action/Input/testHelper"

import { newBoardValidateStack } from "../../../kernel/infra/stack"

import { initValidateBoardFieldAction } from "./impl"

import { ValidateBoardFieldAction, ValidateBoardFieldState } from "./action"

import { BoardConvertResult, markBoardValue } from "../../../kernel/data"

describe("ValidateBoard", () => {
    test("validate; valid input", (done) => {
        const { action, store, validateStack } = standardResource()

        const checker = initSyncActionTestRunner<ValidateBoardFieldState<ValidateError>>()
        const ignition = action.ignition()

        checker.addTestCase(
            () => {
                // valid input
                store.set(markBoardValue("valid"))

                action.check()
            },
            (stack) => {
                expect(stack).toEqual([{ valid: true }])
                expect(validateStack.get("field")).toEqual({ found: true, state: true })
                expect(action.get()).toEqual({ success: true, value: "valid" })
            },
        )

        ignition.addStateHandler(checker.run(done))
    })

    test("validate; invalid input", (done) => {
        const { action, store, validateStack } = standardResource()

        const checker = initSyncActionTestRunner<ValidateBoardFieldState<ValidateError>>()
        const ignition = action.ignition()

        checker.addTestCase(
            () => {
                // invalid input : see validator()
                store.set(markBoardValue(""))

                action.check()
            },
            (stack) => {
                expect(stack).toEqual([{ valid: false, err: ["empty"] }])
                expect(validateStack.get("field")).toEqual({ found: true, state: false })
                expect(action.get()).toEqual({ success: false })
            },
        )

        ignition.addStateHandler(checker.run(done))
    })
})

function standardResource() {
    const store = standardBoardValueStore()
    const stack = newBoardValidateStack()

    const action: ValidateBoardFieldAction<
        FieldValue,
        ValidateError
    > = initValidateBoardFieldAction({ name: "field", converter, validator }, { stack })

    function converter(): BoardConvertResult<FieldValue> {
        return { success: true, value: store.get() }
    }
    function validator(): ValidateError[] {
        if (store.get() === "") {
            return ["empty"]
        }
        return []
    }

    return { store, validateStack: stack, action }
}

type FieldValue = string
type ValidateError = "empty"
