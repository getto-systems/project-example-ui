import {
    FormContainerComponent,
    FormFieldComponent,
    FormFieldComponentState,
    FormInputComponent,
    FormInputComponentState,
    FormContainerComponentState,
} from "./component"

import { FormHistory, FormInputString, FormValidationState, markInputString } from "../../form/data"
import { MockAction, MockPropsPasser } from "../../../getto-example/Application/mock"

export class FormContainerMockComponent
    extends MockAction<FormContainerComponentState>
    implements FormContainerComponent {
    undo(): void {
        // mock では特に何もしない
    }
    redo(): void {
        // mock では特に何もしない
    }
}

export type FormContainerMockProps = Readonly<{ validation: FormValidationState }>

export const formValidationStates: FormValidationState[] = ["initial", "valid", "invalid"]

export class FormFieldMockComponent<S, E>
    extends MockAction<FormFieldComponentState<S, E>>
    implements FormFieldComponent<S, E> {
    validate(): void {
        // mock では特に何もしない
    }
}

export type FormInputMockProps = Readonly<{ input: string }>

export class FormInputMockComponent
    extends MockAction<FormInputComponentState>
    implements FormInputComponent {
    constructor(passer: MockPropsPasser<FormInputMockProps>) {
        super()
        passer.addPropsHandler((props) => {
            this.post({ value: markInputString(props.input) })
        })
    }

    input(_value: FormInputString): void {
        // mock では特に何もしない
    }
    change(): void {
        // mock では特に何もしない
    }
    restore(_history: FormHistory): void {
        // mock では特に何もしない
    }
}
