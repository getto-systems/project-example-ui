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

    undo(): FormHistoryRestoreResult {
        const result = this.undoItem()
        if (!result.found) {
            return { type: "disabled" }
        }

        this.position = this.position - 1
        return { type: "enabled", item: result.item }
    }
    undoEnabled(): boolean {
        return this.undoItem().found
    }
    undoItem(): FindFormHistoryStackResult {
        if (this.position >= this.history.length || this.position <= 0) {
            return { found: false }
        }
        const item = this.history[this.position]
        switch (item.history.previous.type) {
            case "first":
                return { found: false }

            case "hasPrevious":
                return {
                    found: true,
                    item: { path: item.path, history: item.history.previous.history },
                }
        }
    }

    redo(): FormHistoryRestoreResult {
        const result = this.redoItem()
        if (!result.found) {
            return { type: "disabled" }
        }

        this.position = this.position + 1
        return { type: "enabled", item: result.item }
    }
    redoEnabled(): boolean {
        return this.redoItem().found
    }
    redoItem(): FindFormHistoryStackResult {
        if (this.position + 1 >= this.history.length) {
            return { found: false }
        }
        return { found: true, item: this.history[this.position + 1] }
    }
}

type FindFormHistoryStackResult =
    | Readonly<{ found: false }>
    | Readonly<{ found: true; item: FormHistoryStackItem }>
