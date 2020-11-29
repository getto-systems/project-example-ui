import { PasswordFieldComponent, PasswordFieldState } from "./component"

import {
    simplePassword,
    complexPassword,
    hidePassword,
    showPassword,
} from "../../../../password/field/data"

import { markInputValue, noError, hasError } from "../../../../field/data"

export function newPasswordFieldComponent(state: PasswordFieldState): PasswordFieldComponent {
    return new Component(state)
}

export class PasswordFieldStateFactory {
    noError(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: noError(),
            character: simplePassword,
            view: hidePassword,
        }
    }
    empty(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: hasError(["empty"]),
            character: simplePassword,
            view: hidePassword,
        }
    }
    tooLong(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: hasError(["too-long"]),
            character: simplePassword,
            view: hidePassword,
        }
    }
    complex_tooLong(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: hasError(["too-long"]),
            character: complexPassword,
            view: hidePassword,
        }
    }
    complex(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: noError(),
            character: complexPassword,
            view: hidePassword,
        }
    }
    show(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: noError(),
            character: simplePassword,
            view: showPassword(markInputValue("password")),
        }
    }
}

class Component implements PasswordFieldComponent {
    state: PasswordFieldState

    constructor(state: PasswordFieldState) {
        this.state = state
    }

    onStateChange(post: Post<PasswordFieldState>): void {
        post(this.state)
    }
    set(): void {
        // mock では特に何もしない
    }
    show(): void {
        // mock では特に何もしない
    }
    hide(): void {
        // mock では特に何もしない
    }
    validate(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
