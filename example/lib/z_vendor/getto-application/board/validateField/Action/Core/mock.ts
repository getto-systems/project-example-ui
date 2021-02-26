import { ApplicationAbstractStateAction } from "../../../../action/impl"

import { ValidateBoardFieldAction, ValidateBoardFieldState } from "./action"

import { BoardFieldConvertResult } from "../../data"

export function initMockValidateBoardFieldAction<N extends string, T, E>(
    name: N,
    value: BoardFieldConvertResult<T, E>,
): ValidateBoardFieldAction<T, E> {
    return new Mock(name, value)
}

class Mock<T, E>
    extends ApplicationAbstractStateAction<ValidateBoardFieldState<E>>
    implements ValidateBoardFieldAction<T, E> {
    readonly initialState: ValidateBoardFieldState<E> = { valid: true }

    readonly name: string
    value: BoardFieldConvertResult<T, E>

    constructor(name: string, value: BoardFieldConvertResult<T, E>) {
        super()
        this.name = name
        this.value = value
    }

    get(): BoardFieldConvertResult<T, E> {
        return this.value
    }
    check(): void {
        // mock では特に何もしない
    }
}
