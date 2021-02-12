import { ApplicationBaseComponent } from "../../../getto-example/Application/impl"

import {
    FormComponentState,
    FormFieldComponent,
    FormFieldHandler,
    FormFieldComponentState,
    FormInputComponent,
    FormInputComponentState,
    FormInputMaterial,
    FormMaterial,
    FormComponent,
    FormInputFinder,
} from "./component"

import { FormChangeEvent, FormInputEvent } from "../../form/event"

import {
    FormFieldName,
    FormHistory,
    FormHistoryStackItem,
    FormInputString,
    mapValidationResult,
} from "../../form/data"

export class FormBaseComponent<M extends FormMaterial>
    extends ApplicationBaseComponent<FormComponentState>
    implements FormComponent {
    material: M
    finder: FormInputFinder

    constructor(material: M, finder: FormInputFinder) {
        super()
        this.material = material
        this.finder = finder
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

    currentState(): FormComponentState {
        return {
            validation: this.material.validation.state(),
            history: this.material.history.state(),
        }
    }

    undo(): void {
        const result = this.material.history.undo()
        switch (result.type) {
            case "disabled":
                return

            case "enabled":
                this.restore(result.item)
                return
        }
    }
    redo(): void {
        const result = this.material.history.redo()
        switch (result.type) {
            case "disabled":
                return

            case "enabled":
                this.restore(result.item)
                return
        }
    }
    restore(item: FormHistoryStackItem): void {
        const result = this.finder(item.path)
        if (!result.found) {
            return
        }
        result.input.restore(item.history)        
    }
}

export type FormFieldFactory<S, E> = Readonly<{
    state: { (): FormFieldComponentState<S, E> }
}>

export class FormFieldBaseComponent<S, E>
    extends ApplicationBaseComponent<FormFieldComponentState<S, E>>
    implements FormFieldComponent<S, E> {
    state: { (): FormFieldComponentState<S, E> }
    onValidate: Handler<FormFieldComponentState<S, E>>
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

class Input extends ApplicationBaseComponent<FormInputComponentState> implements FormInputComponent {
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
