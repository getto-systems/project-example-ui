import { initSyncActionTestRunner } from "../../../../action/testHelper"
import { standardBoardValueStore } from "../../../input/Action/testHelper"

import { newBoardValidateStack } from "../../../kernel/infra/stack"

import { initValidateBoardFieldAction } from "./impl"

import { ValidateBoardFieldAction } from "./action"

import { BoardConvertResult, markBoardValue } from "../../../kernel/data"

describe("ValidateBoardField", () => {
    test("validate; valid input", (done) => {
        const { action, store, validateStack } = standardResource()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // valid input
                    store.set(markBoardValue("valid"))

                    action.check()
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: true }])
                    expect(validateStack.get("field")).toEqual({ found: true, state: true })
                    expect(action.get()).toEqual({ success: true, value: "valid" })
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("validate; invalid input", (done) => {
        const { action, store, validateStack } = standardResource()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // invalid input : see validator()
                    store.set(markBoardValue(""))

                    action.check()
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: false, err: ["empty"] }])
                    expect(validateStack.get("field")).toEqual({ found: true, state: false })
                    expect(action.get()).toEqual({ success: false })
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
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
