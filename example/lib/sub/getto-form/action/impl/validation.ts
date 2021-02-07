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
        return this.validationState.reduce((acc, state) => {
            switch (acc) {
                case "initial":
                case "invalid":
                    return acc

                case "valid":
                    return state.state
            }
        }, <FormValidationState>"valid")
    }
}
