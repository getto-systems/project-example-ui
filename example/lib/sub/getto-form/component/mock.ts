import { MockComponent } from "../../getto-example/application/mock"

import {
    FormComponent,
    FormFieldComponent,
    FormFieldComponentState,
    FormInputComponent,
    FormInputComponentState,
    FormComponentState,
} from "./component"

import { FormHistory, FormInputString, markInputString } from "../action/data"

export class FormMockComponent extends MockComponent<FormComponentState> implements FormComponent {
    undo(): void {
        // mock では特に何もしない
    }
    redo(): void {
        // mock では特に何もしない
    }
}

export class FormFieldMockComponent<S, E>
    extends MockComponent<FormFieldComponentState<S, E>>
    implements FormFieldComponent<S, E> {
    validate(): void {
        // mock では特に何もしない
    }
}

export class FormInputMockComponent extends MockComponent<FormInputComponentState> implements FormInputComponent {
    constructor() {
        super({ value: markInputString("") })
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
