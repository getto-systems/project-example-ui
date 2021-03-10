import { setupSyncActionTestRunner } from "../../action/test_helper"

import { initValidateBoardAction } from "./core/impl"

describe("ValidateBoard", () => {
    test("validate; all valid state", (done) => {
        const { action, handler } = standard()

        const runner = setupSyncActionTestRunner([
            {
                statement: () => {
                    // all valid
                    handler.name({ valid: true })
                    handler.description({ valid: true })
                },
                examine: (stack) => {
                    expect(stack).toEqual(["initial", "valid"])
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("validate; invalid exists", (done) => {
        const { action, handler } = standard()

        const runner = setupSyncActionTestRunner([
            {
                statement: () => {
                    handler.name({ valid: false, err: ["invalid"] }) // invalid
                    handler.description({ valid: true })
                },
                examine: (stack) => {
                    expect(stack).toEqual(["invalid", "invalid"])
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("validate; initial exists", (done) => {
        const { action, handler } = standard()

        const runner = setupSyncActionTestRunner([
            {
                statement: () => {
                    handler.name({ valid: true })
                    // description: initial state
                },
                examine: (stack) => {
                    expect(stack).toEqual(["initial"])
                },
            },
        ])

        action.subscriber.subscribe(runner(done))
    })

    test("get", () => {
        const { action } = standard()

        expect(action.get()).toEqual({
            valid: true,
            value: { name: "valid-name", value: "valid-value" },
        })
    })
})

function standard() {
    const action = initValidateBoardAction({
        fields: ["name", "description"],
        converter: () => ({ valid: true, value: { name: "valid-name", value: "valid-value" } }),
    })

    const handler = {
        name: action.updateValidateState("name"),
        description: action.updateValidateState("description"),
    }

    return { action, handler }
}
