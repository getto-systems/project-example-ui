import { setupSyncActionTestRunner } from "../../action/test_helper"

import { initValidateBoardFieldAction } from "./core/impl"

import { ValidateBoardFieldAction } from "./core/action"

import { ConvertBoardFieldResult } from "../validate_field/data"

describe("ValidateBoardField", () => {
    test("validate; valid input", (done) => {
        // valid input
        const { action } = standard({ valid: true, value: "valid" })

        const runner = setupSyncActionTestRunner([
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
        const { action } = standard({ valid: false, err: ["empty"] })

        const runner = setupSyncActionTestRunner([
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

function standard(result: ConvertBoardFieldResult<FieldValue, ValidateError>) {
    const action: ValidateBoardFieldAction<
        FieldValue,
        ValidateError
    > = initValidateBoardFieldAction({ converter: () => result })

    return { action }
}

type FieldValue = string
type ValidateError = "empty"
