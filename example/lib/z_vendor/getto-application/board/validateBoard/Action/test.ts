import { initSyncActionTestRunner } from "../../../action/testHelper"

import { initValidateBoardInfra } from "../../kernel/impl"

import { initValidateBoardAction } from "./Core/impl"

import { ConvertBoardResult } from "../../kernel/data"

describe("ValidateBoard", () => {
    test("validate; all valid state", (done) => {
        const { action, validateStack } = standardResource()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // all valid
                    validateStack.update("name", true)
                    validateStack.update("value", true)

                    action.check()
                },
                examine: (stack) => {
                    expect(stack).toEqual(["valid"])
                    expect(action.get()).toEqual({
                        valid: true,
                        value: { name: "valid-name", value: "valid-value" },
                    })
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("validate; invalid exists", (done) => {
        const { action, validateStack } = standardResource()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    validateStack.update("name", false) // invalid
                    validateStack.update("value", true)

                    action.check()
                },
                examine: (stack) => {
                    expect(stack).toEqual(["invalid"])
                    expect(action.get()).toEqual({ valid: false })
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("validate; initial exists", (done) => {
        const { action, validateStack } = standardResource()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    validateStack.update("name", true)
                    // validateStack.update("value", true) // initial

                    action.check()
                },
                examine: (stack) => {
                    expect(stack).toEqual(["initial"])
                    expect(action.get()).toEqual({ valid: false })
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("validate; all initial", (done) => {
        const { action } = standardResource()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // all initial

                    action.check()
                },
                examine: (stack) => {
                    expect(stack).toEqual(["initial"])
                    expect(action.get()).toEqual({ valid: false })
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })
})

function standardResource() {
    const infra = initValidateBoardInfra()

    const action = initValidateBoardAction({ fields: ["name", "value"], converter }, infra)

    return { validateStack: infra.stack, action }

    type Fields = Readonly<{ name: string; value: string }>

    function converter(): ConvertBoardResult<Fields> {
        return { valid: true, value: { name: "valid-name", value: "valid-value" } }
    }
}
