import { FormHistoryStack, FormHistoryStackPod } from "../action"
import {
    FormHistory,
    FormHistoryPath,
    FormHistoryRestoreResult,
    FormHistoryStackItem,
    FormHistoryState,
} from "../data"

export const historyStack = (): FormHistoryStackPod => () => new Stack()

class Stack implements FormHistoryStack {
    history: FormHistoryStackItem[] = []
    position = 0

    push(path: FormHistoryPath, history: FormHistory): void {
        this.history = [...this.history.slice(0, this.position + 1), { history, path }]
        this.position = this.history.length - 1
    }

    state(): FormHistoryState {
        return {
            undo: this.undoEnabled(),
            redo: this.redoEnabled(),
        }
    }

    moveTo(result: FindFormHistoryStackResult): FormHistoryRestoreResult {
        if (!result.found) {
            return { type: "disabled" }
        }

        this.position = result.nextPosition
        return { type: "enabled", item: result.item }
    }

    undo(): FormHistoryRestoreResult {
        return this.moveTo(this.undoItem())
    }
    undoEnabled(): boolean {
        return this.undoItem().found
    }
    undoItem(): FindFormHistoryStackResult {
        if (this.position >= 0 && this.position < this.history.length) {
            const item = this.history[this.position]
            switch (item.history.previous.type) {
                case "first":
                    return { found: false }

                case "hasPrevious":
                    return {
                        found: true,
                        item: {
                            path: item.path,
                            history: item.history.previous.history,
                        },
                        nextPosition: this.position - 1,
                    }
            }
        }
        return { found: false }
    }

    redo(): FormHistoryRestoreResult {
        return this.moveTo(this.redoItem())
    }
    redoEnabled(): boolean {
        return this.redoItem().found
    }
    redoItem(): FindFormHistoryStackResult {
        const nextPosition = this.position + 1
        if (nextPosition >= 0 && nextPosition < this.history.length) {
            return { found: true, item: this.history[nextPosition], nextPosition }
        }
        return { found: false }
    }
}

type FindFormHistoryStackResult =
    | Readonly<{ found: false }>
    | Readonly<{ found: true; item: FormHistoryStackItem; nextPosition: number }>
