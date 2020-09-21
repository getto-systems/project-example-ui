import { InputValue } from "./data"

export function initInputValue(inputValue: string): InputValue {
    return inputValue as _InputValue
}

export function inputValueToString(inputValue: InputValue): Readonly<string> {
    return inputValue as unknown as string
}

type _InputValue = string & { InputValue: never }
