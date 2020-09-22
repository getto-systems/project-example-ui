import { InputValue } from "./data"

export function initInputValue(inputValue: string): InputValue {
    return inputValue as string & InputValue
}

export function inputValueToString(inputValue: InputValue): string {
    return inputValue as unknown as string
}
