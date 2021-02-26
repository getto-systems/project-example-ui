import { BoardValidateStack, BoardValidateStackFound } from "../infra"

export function initBoardValidateStack(): BoardValidateStack {
    return new Stack()
}

class Stack implements BoardValidateStack {
    stack: Record<string, boolean> = {}

    get(name: string): BoardValidateStackFound {
        if (name in this.stack) {
            return { found: true, state: this.stack[name] }
        }
        return { found: false }
    }
    update(name: string, result: boolean): void {
        this.stack[name] = result
    }
}
