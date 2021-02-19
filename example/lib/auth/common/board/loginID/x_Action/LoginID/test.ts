import { markBoardValue } from "../../../../../../common/vendor/getto-board/kernel/data"
import { newBoard } from "../../../../../../common/vendor/getto-board/kernel/infra/board"
import { newBoardValidateStack } from "../../../../../../common/vendor/getto-board/kernel/infra/stack"
import { ValidateBoardState } from "../../../../../../common/vendor/getto-board/validate/x_Action/Validate/action"
import { initSyncActionChecker } from "../../../../../../common/vendor/getto-example/Application/testHelper"
import { ValidateLoginIDError } from "./data"
import { initLoginIDBoardResource } from "./impl"

describe("LoginIDBoard", () => {
    test("validate; valid input", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidateLoginIDError>>()
        resource.validate.addStateHandler(checker.handler)

        // valid input
        resource.input.set(markBoardValue("valid"))

        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-validate", result: { valid: true } }])
        })
    })

    test("validate; invalid : empty", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidateLoginIDError>>()
        resource.validate.addStateHandler(checker.handler)

        // empty
        resource.input.set(markBoardValue(""))

        checker.check((stack) => {
            expect(stack).toEqual([
                { type: "succeed-to-validate", result: { valid: false, err: ["empty"] } },
            ])
        })
    })

    test("validate; invalid : too-long", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidateLoginIDError>>()
        resource.validate.addStateHandler(checker.handler)

        // too-long
        resource.input.set(markBoardValue("a".repeat(100 + 1)))

        checker.check((stack) => {
            expect(stack).toEqual([
                { type: "succeed-to-validate", result: { valid: false, err: ["too-long"] } },
            ])
        })
    })

    test("validate; valid : just max-length", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidateLoginIDError>>()
        resource.validate.addStateHandler(checker.handler)

        // just max-length
        resource.input.set(markBoardValue("a".repeat(100)))

        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-validate", result: { valid: true } }])
        })
    })

    test("terminate", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidateLoginIDError>>()
        resource.validate.addStateHandler(checker.handler)

        resource.input.terminate()

        resource.input.set(markBoardValue(""))

        checker.check((stack) => {
            expect(stack).toEqual([])
        })
    })
})

function standardResource() {
    const board = newBoard()
    const stack = newBoardValidateStack()

    const resource = initLoginIDBoardResource({ name: "field" }, { board, stack })

    return { resource }
}
