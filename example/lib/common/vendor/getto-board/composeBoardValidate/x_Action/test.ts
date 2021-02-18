import { initSyncActionChecker } from "../../../getto-example/Application/testHelper"
import { newBoardValidateStack } from "../../kernel/infra/stack"
import { ComposeBoardValidateResource, ComposeBoardValidateState } from "./action"
import { initComposeBoardValidateAction } from "./impl"

describe("ComposeBoardValidate", () => {
    test("validate; all valid state", () => {
        const { resource, validateStack } = standardResource()

        const checker = initSyncActionChecker<ComposeBoardValidateState>()
        resource.state.addStateHandler(checker.handler)

        // all valid
        validateStack.update("name", true)
        validateStack.update("value", true)

        resource.state.compose()
        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-compose", state: "valid" }])
        })
    })

    test("validate; invalid exists", () => {
        const { resource, validateStack } = standardResource()

        const checker = initSyncActionChecker<ComposeBoardValidateState>()
        resource.state.addStateHandler(checker.handler)

        validateStack.update("name", false) // invalid
        validateStack.update("value", true)

        resource.state.compose()
        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-compose", state: "invalid" }])
        })
    })

    test("validate; initial exists", () => {
        const { resource, validateStack } = standardResource()

        const checker = initSyncActionChecker<ComposeBoardValidateState>()
        resource.state.addStateHandler(checker.handler)

        validateStack.update("name", true)
        // validateStack.update("value", true) // initial

        resource.state.compose()
        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-compose", state: "initial" }])
        })
    })

    test("validate; all initial", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ComposeBoardValidateState>()
        resource.state.addStateHandler(checker.handler)

        resource.state.compose()
        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-compose", state: "initial" }])
        })
    })
})

function standardResource() {
    const stack = newBoardValidateStack()

    const resource: ComposeBoardValidateResource = {
        state: initComposeBoardValidateAction({ fields: ["name", "value"] }, { stack }),
    }

    return { validateStack: stack, resource }
}
