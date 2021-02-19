import { markBoardValue } from "../../../../../../common/vendor/getto-board/kernel/data"
import { newBoard } from "../../../../../../common/vendor/getto-board/kernel/infra/board"
import { newBoardValidateStack } from "../../../../../../common/vendor/getto-board/kernel/infra/stack"
import { ValidateBoardState } from "../../../../../../common/vendor/getto-board/validate/x_Action/Validate/action"
import { initSyncActionChecker } from "../../../../../../common/vendor/getto-example/Application/testHelper"
import { TogglePasswordDisplayBoardState } from "./action"
import { ValidatePasswordError } from "./data"
import { initPasswordBoardResource } from "./impl"

describe("PasswordBoard", () => {
    test("validate; valid input", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        // valid input
        resource.input.set(markBoardValue("valid"))

        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-validate", result: { valid: true } }])
        })
    })

    test("validate; invalid : empty", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidatePasswordError>>()
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

        const checker = initSyncActionChecker<ValidateBoardState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        // too-long
        resource.input.set(markBoardValue("a".repeat(72 + 1)))

        checker.check((stack) => {
            expect(stack).toEqual([
                { type: "succeed-to-validate", result: { valid: false, err: ["too-long"] } },
            ])
        })
    })

    test("validate; valid : just max-length", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        // just max-length
        resource.input.set(markBoardValue("a".repeat(72)))

        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-validate", result: { valid: true } }])
        })
    })

    test("validate; invalid : too-long : multi-byte", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        // too-long : "あ"(UTF8) is 3 bytes character
        resource.input.set(markBoardValue("あ".repeat(24) + "a"))

        checker.check((stack) => {
            expect(stack).toEqual([
                { type: "succeed-to-validate", result: { valid: false, err: ["too-long"] } },
            ])
        })
    })

    test("validate; valid : just max-length : multi-byte", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        // just max-length : "あ"(UTF8) is 3 bytes character
        resource.input.set(markBoardValue("あ".repeat(24)))

        checker.check((stack) => {
            expect(stack).toEqual([{ type: "succeed-to-validate", result: { valid: true } }])
        })
    })

    test("toggle password", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<TogglePasswordDisplayBoardState>()
        resource.toggle.addStateHandler(checker.handler)

        resource.toggle.show()

        checker.check((stack) => {
            expect(stack).toEqual([{ visible: true }])
        })

        resource.toggle.hide()

        checker.check((stack) => {
            expect(stack).toEqual([{ visible: false }])
        })
    })

    test("password character state : single byte", () => {
        const { resource } = standardResource()

        resource.input.set(markBoardValue("password"))
        expect(resource.characterState()).toEqual({ multiByte: false })
    })

    test("password character state : multi byte", () => {
        const { resource } = standardResource()

        resource.input.set(markBoardValue("パスワード"))
        expect(resource.characterState()).toEqual({ multiByte: true })
    })

    test("terminate", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardState<ValidatePasswordError>>()
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

    const resource = initPasswordBoardResource({ name: "field" }, { board, stack })

    return { resource }
}
