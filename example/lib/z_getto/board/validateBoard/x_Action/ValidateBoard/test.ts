import { initSyncActionChecker_simple } from "../../../../application/testHelper"
import { BoardConvertResult } from "../../../kernel/data"
import { newBoardValidateStack } from "../../../kernel/infra/stack"
import { ValidateBoardState } from "./action"
import { initValidateBoardAction } from "./impl"

describe("ComposeBoardValidate", () => {
    test("validate; all valid state", () => {
        const { action, validateStack } = standardResource()

        const checker = initSyncActionChecker_simple<ValidateBoardState>()

        const ignition = action.ignition()
        ignition.addStateHandler(checker.handler)

        // all valid
        validateStack.update("name", true)
        validateStack.update("value", true)

        action.check()
        checker.check((stack) => {
            expect(stack).toEqual(["valid"])
        })
        expect(action.get()).toEqual({
            success: true,
            value: { name: "valid-name", value: "valid-value" },
        })
    })

    test("validate; invalid exists", () => {
        const { action, validateStack } = standardResource()

        const checker = initSyncActionChecker_simple<ValidateBoardState>()

        const ignition = action.ignition()
        ignition.addStateHandler(checker.handler)

        validateStack.update("name", false) // invalid
        validateStack.update("value", true)

        action.check()
        checker.check((stack) => {
            expect(stack).toEqual(["invalid"])
        })
        expect(action.get()).toEqual({ success: false })
    })

    test("validate; initial exists", () => {
        const { action, validateStack } = standardResource()

        const checker = initSyncActionChecker_simple<ValidateBoardState>()

        const ignition = action.ignition()
        ignition.addStateHandler(checker.handler)

        validateStack.update("name", true)
        // validateStack.update("value", true) // initial

        action.check()
        checker.check((stack) => {
            expect(stack).toEqual(["initial"])
        })
        expect(action.get()).toEqual({ success: false })
    })

    test("validate; all initial", () => {
        const { action } = standardResource()

        const checker = initSyncActionChecker_simple<ValidateBoardState>()

        const ignition = action.ignition()
        ignition.addStateHandler(checker.handler)

        action.check()
        checker.check((stack) => {
            expect(stack).toEqual(["initial"])
        })
        expect(action.get()).toEqual({ success: false })
    })
})

function standardResource() {
    const stack = newBoardValidateStack()

    const action = initValidateBoardAction({ fields: ["name", "value"], converter }, { stack })

    return { validateStack: stack, action }

    type Fields = Readonly<{ name: string; value: string }>

    function converter(): BoardConvertResult<Fields> {
        return { success: true, value: { name: "valid-name", value: "valid-value" } }
    }
}
