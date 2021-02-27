import { initSyncActionTestRunner } from "../../../action/testHelper"

import { initValidateBoardFieldAction } from "./Core/impl"

import { ValidateBoardFieldAction } from "./Core/action"

import { ConvertBoardFieldResult } from "../data"

describe("ValidateBoardField", () => {
    test("validate; valid input", (done) => {
        // valid input
        const { action } = standardElements({ valid: true, value: "valid" })

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    action.check()
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: true }])
                    expect(action.get()).toEqual({ valid: true, value: "valid" })
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("validate; invalid input", (done) => {
        // invalid input
        const { action } = standardElements({ valid: false, err: ["empty"] })

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    action.check()
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: false, err: ["empty"] }])
                    expect(action.get()).toEqual({ valid: false, err: ["empty"] })
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })
})

function standardElements(result: ConvertBoardFieldResult<FieldValue, ValidateError>) {
    const action: ValidateBoardFieldAction<
        FieldValue,
        ValidateError
    > = initValidateBoardFieldAction({ converter: () => result })

    return { action }
}

type FieldValue = string
type ValidateError = "empty"
