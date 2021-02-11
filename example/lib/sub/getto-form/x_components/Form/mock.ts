import {
    FormComponent,
    FormFieldComponent,
    FormFieldComponentState,
    FormInputComponent,
    FormInputComponentState,
    FormComponentState,
} from "./component"

import { FormHistory, FormInputString, FormValidationState, markInputString } from "../../form/data"
import { MockComponent, MockPropsPasser } from "../../../getto-example/x_components/Application/mock"

export class FormMockComponent
    extends MockComponent<FormComponentState>
    implements FormComponent {
    undo(): void {
        // mock では特に何もしない
    }
    redo(): void {
        // mock では特に何もしない
    }
}

export type FormMockProps = Readonly<{ validation: FormValidationState }>

export const formValidationStates: FormValidationState[] = ["initial", "valid", "invalid"]

export class FormFieldMockComponent<S, E>
    extends MockComponent<FormFieldComponentState<S, E>>
    implements FormFieldComponent<S, E> {
    validate(): void {
        // mock では特に何もしない
    }
}

export type FormInputMockProps = Readonly<{ input: string }>

export class FormInputMockComponent
    extends MockComponent<FormInputComponentState>
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
