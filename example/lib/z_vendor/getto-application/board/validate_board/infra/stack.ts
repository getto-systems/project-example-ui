import { ValidateBoardStack, ValidateBoardStateFound } from "../infra"

export function initValidateBoardStack(): ValidateBoardStack {
    return new Stack()
}

class Stack implements ValidateBoardStack {
    stack: Record<string, boolean> = {}

    get(name: string): ValidateBoardStateFound {
        if (name in this.stack) {
            return { found: true, state: this.stack[name] }
        }
        return { found: false }
    }
    set(name: string, result: boolean): void {
        this.stack[name] = result
    }
}
