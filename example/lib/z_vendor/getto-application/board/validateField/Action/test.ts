import { initSyncActionTestRunner } from "../../../action/testHelper"
import { standardBoardValueStore } from "../../input/Action/testHelper"

import { initValidateBoardFieldAction } from "./Core/impl"

import { ValidateBoardFieldAction } from "./Core/action"

import { BoardValue, markBoardValue } from "../../kernel/data"
import { initValidateBoardInfra } from "../../kernel/impl"
import { ConvertBoardFieldResult } from "../data"

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
                    expect(action.get()).toEqual({ valid: true, value: "valid" })
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
                    expect(action.get()).toEqual({ valid: false, err: ["empty"] })
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })
})

function standardResource() {
    const store = standardBoardValueStore()
    const infra = initValidateBoardInfra()

    const action: ValidateBoardFieldAction<
        FieldValue,
        ValidateError
    > = initValidateBoardFieldAction({ name: "field", getter: () => store.get(), converter }, infra)

    function converter(value: BoardValue): ConvertBoardFieldResult<FieldValue, ValidateError> {
        if (value === "") {
            return { valid: false, err: ["empty"] }
        }
        return { valid: true, value: store.get() }
    }

    return { store, validateStack: infra.stack, action }
}

type FieldValue = string
type ValidateError = "empty"
