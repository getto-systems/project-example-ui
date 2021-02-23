import {
    initSyncActionChecker_simple,
    initSyncActionTestRunner,
} from "../../../../../../z_getto/application/testHelper"
import { standardBoardValueStore } from "../../../../../../z_getto/board/input/x_Action/Input/testHelper"

import { newBoardValidateStack } from "../../../../../../z_getto/board/kernel/infra/stack"

import { initLoginIDBoardFieldAction } from "./impl"

import { ValidateBoardFieldState } from "../../../../../../z_getto/board/validateField/x_Action/ValidateField/action"

import { markBoardValue } from "../../../../../../z_getto/board/kernel/data"
import { ValidateLoginIDError } from "./data"

describe("LoginIDBoard", () => {
    test("validate; valid input", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker_simple<
            ValidateBoardFieldState<ValidateLoginIDError>
        >()

        const ignition = resource.validate.ignition()
        ignition.subscribe(checker.handler)

        // valid input
        resource.input.set(markBoardValue("valid"))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: true }])
        })
        expect(resource.validate.get()).toEqual({ success: true, value: "valid" })
    })

    test("validate; invalid : empty", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker_simple<
            ValidateBoardFieldState<ValidateLoginIDError>
        >()

        const ignition = resource.validate.ignition()
        ignition.subscribe(checker.handler)

        // empty
        resource.input.set(markBoardValue(""))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: false, err: ["empty"] }])
        })
        expect(resource.validate.get()).toEqual({ success: false })
    })

    test("validate; invalid : too-long", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker_simple<
            ValidateBoardFieldState<ValidateLoginIDError>
        >()

        const ignition = resource.validate.ignition()
        ignition.subscribe(checker.handler)

        // too-long
        resource.input.set(markBoardValue("a".repeat(100 + 1)))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: false, err: ["too-long"] }])
        })
        expect(resource.validate.get()).toEqual({ success: false })
    })

    test("validate; valid : just max-length", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker_simple<
            ValidateBoardFieldState<ValidateLoginIDError>
        >()

        const ignition = resource.validate.ignition()
        ignition.subscribe(checker.handler)

        // just max-length
        resource.input.set(markBoardValue("a".repeat(100)))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: true }])
        })
        expect(resource.validate.get()).toEqual({ success: true, value: "a".repeat(100) })
    })

    test("clear", () => {
        const { resource } = standardResource()

        resource.input.set(markBoardValue("valid"))
        resource.clear()

        expect(resource.input.get()).toEqual("")
    })

    test("terminate", (done) => {
        const { resource } = standardResource()

        const ignition = resource.validate.ignition()

        const runner = initSyncActionTestRunner()

        runner.addTestCase(
            () => {
                resource.terminate()
                resource.input.set(markBoardValue("valid"))
            },
            (stack) => {
                // no input/validate event after terminate
                expect(stack).toEqual([])
            },
        )

        const handler = runner.run(done)
        resource.input.addInputHandler(() => handler(resource.input.get()))
        ignition.subscribe(handler)
    })
})

function standardResource() {
    const stack = newBoardValidateStack()

    const resource = initLoginIDBoardFieldAction({ name: "field" }, { stack })
    resource.input.linkStore(standardBoardValueStore())

    return { resource }
}
