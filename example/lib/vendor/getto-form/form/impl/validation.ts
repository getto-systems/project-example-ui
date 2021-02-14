import { FormValidationStateSet, FormValidationStateSetPod } from "../action"
import { FormFieldName, FormValidationState } from "../data"

export const validationStateSet = (): FormValidationStateSetPod => () => new Set()

class Set implements FormValidationStateSet {
    validationState: Readonly<{
        field: FormFieldName
        state: FormValidationState
    }>[] = []

    update(name: FormFieldName, state: FormValidationState): void {
        this.validationState = [
            ...this.validationState.filter((state) => state.field !== name),
            { field: name, state },
        ]
    }
    state(): FormValidationState {
        if (this.validationState.every((state) => state.state === "valid")) {
            return "valid"
        }
        if (this.validationState.some((state) => state.state === "invalid")) {
            return "invalid"
        }
        return "initial"
    }
}
