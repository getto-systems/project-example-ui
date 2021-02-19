import { markBoardValue } from "../../../../../../common/vendor/getto-board/kernel/data"
import { newBoard } from "../../../../../../common/vendor/getto-board/kernel/infra/board"
import { newBoardValidateStack } from "../../../../../../common/vendor/getto-board/kernel/infra/stack"
import { ValidateBoardFieldState } from "../../../../../../common/vendor/getto-board/validateField/x_Action/ValidateField/action"
import { initSyncActionChecker } from "../../../../../../common/vendor/getto-example/Application/testHelper"
import { ValidateLoginIDError } from "./data"
import { initLoginIDBoardFieldAction } from "./impl"

describe("LoginIDBoard", () => {
    test("validate; valid input", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidateLoginIDError>>()
        resource.validate.addStateHandler(checker.handler)

        // valid input
        resource.input.set(markBoardValue("valid"))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: true }])
        })
        expect(resource.validate.get()).toEqual({ success: true, value: "valid" })
    })

    test("validate; invalid : empty", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidateLoginIDError>>()
        resource.validate.addStateHandler(checker.handler)

        // empty
        resource.input.set(markBoardValue(""))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: false, err: ["empty"] }])
        })
        expect(resource.validate.get()).toEqual({ success: false })
    })

    test("validate; invalid : too-long", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidateLoginIDError>>()
        resource.validate.addStateHandler(checker.handler)

        // too-long
        resource.input.set(markBoardValue("a".repeat(100 + 1)))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: false, err: ["too-long"] }])
        })
        expect(resource.validate.get()).toEqual({ success: false })
    })

    test("validate; valid : just max-length", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidateLoginIDError>>()
        resource.validate.addStateHandler(checker.handler)

        // just max-length
        resource.input.set(markBoardValue("a".repeat(100)))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: true }])
        })
        expect(resource.validate.get()).toEqual({ success: true, value: "a".repeat(100) })
    })

    test("terminate", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidateLoginIDError>>()
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

    const resource = initLoginIDBoardFieldAction({ name: "field" }, { board, stack })

    return { resource }
}
