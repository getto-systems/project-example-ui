import { InputValue } from "./data"

export function packInputValue(inputValue: string): InputValue {
    return inputValue as InputValue & string
}

export function unpackInputValue(inputValue: InputValue): string {
    return inputValue as unknown as string
}
