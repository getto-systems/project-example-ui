import { BoardValidateStack } from "../infra"

export function newBoardValidateStack(): BoardValidateStack {
    return new Stack()
}

class Stack implements BoardValidateStack {
    stack: Record<string, boolean> = {}

    get(name: string): boolean {
        return this.stack[name] || false
    }
    update(name: string, result: boolean): void {
        this.stack[name] = result
    }
}
