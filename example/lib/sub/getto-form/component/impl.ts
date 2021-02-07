import { ApplicationBaseComponent } from "../../getto-example/application/impl"

import {
    FormState,
    FormFieldComponent,
    FormFieldHandler,
    FormFieldState,
    FormInputComponent,
    FormInputState,
    FormInputMaterial,
    FormMaterial,
} from "./component"

import { FormChangeEvent, FormInputEvent } from "../action/event"

import { FormFieldName, FormHistory, mapValidationResult } from "../action/data"
import { FormInputString } from "../data"

export class FormBaseComponent<M extends FormMaterial> extends ApplicationBaseComponent<
    FormState
> {
    material: M

    constructor(material: M) {
        super()
        this.material = material
    }

    initField<F extends FormFieldComponent<S, E>, S, E>(
        name: FormFieldName,
        init: { (handler: FormFieldHandler): F }
    ): F {
        this.material.validation.update(name, "initial")
        return init({
            validate: (state) => {
                this.material.validation.update(name, state)
                this.post(this.currentState())
            },
            history: (event) => {
                this.material.history.push({ field: name, input: event.input }, event.history)
                this.post(this.currentState())
            },
        })
    }

    currentState(): FormState {
        return {
            validation: this.material.validation.state(),
            history: this.material.history.state(),
        }
    }
}

export type FormFieldFactory<S, E> = Readonly<{
    state: { (): FormFieldState<S, E> }
}>

export class FormFieldBaseComponent<S, E>
    extends ApplicationBaseComponent<FormFieldState<S, E>>
    implements FormFieldComponent<S, E> {
    state: { (): FormFieldState<S, E> }
    onValidate: Handler<FormFieldState<S, E>>
    onHistory: { (name: FormFieldName): Handler<FormHistory> }

    constructor(handler: FormFieldHandler, { state }: FormFieldFactory<S, E>) {
        super()

        this.state = state
        this.onValidate = (state) => {
            handler.validate(mapValidationResult(state.result))
        }
        this.onHistory = (name) => (history) => {
            handler.history({ history, input: name })
        }
    }

    initInput(name: FormFieldName, material: FormInputMaterial): FormInputComponent {
        const onHistory = this.onHistory(name)
        return initFormInputComponent(material, {
            input: () => {
                this.validate()
            },
            history: (history) => {
                onHistory(history)
            },
        })
    }

    validate(): void {
        const state = this.state()
        this.post(state)
        this.onValidate(state)
    }
}

export type FormInputHandler = Readonly<{
    input: { (): void }
    history: Handler<FormHistory>
}>
export function initFormInputComponent(
    material: FormInputMaterial,
    handler: FormInputHandler
): FormInputComponent {
    return new Input(material, handler)
}

class Input extends ApplicationBaseComponent<FormInputState> implements FormInputComponent {
    material: FormInputMaterial
    onInput: Handler<FormInputEvent>
    onChange: Handler<FormChangeEvent>

    constructor(material: FormInputMaterial, handler: FormInputHandler) {
        super()
        this.material = material

        this.onInput = (event) => {
            handler.input()
            this.post(event)
        }
        this.onChange = (event) => {
            handler.history(event.history)
        }
    }

    input(value: FormInputString): void {
        this.material.input.input(value, this.onInput)
    }
    change(): void {
        this.material.input.change(this.onChange)
    }
    restore(history: FormHistory): void {
        this.material.input.restore(history, this.onInput)
    }
}

interface Handler<E> {
    (event: E): void
}
