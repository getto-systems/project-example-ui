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
        this.history = [...this.history.slice(0, this.position), { history, path }]
        this.position = this.history.length - 1
    }

    state(): FormHistoryState {
        return {
            undo: this.undoEnabled(),
            redo: this.redoEnabled(),
        }
    }

    undo(): FormHistoryRestoreResult {
        if (this.position >= this.history.length) {
            return { type: "disabled" }
        }
        const item = this.history[this.position]
        switch (item.history.previous.type) {
            case "first":
                return { type: "disabled" }

            case "hasPrevious":
                this.position = this.position - 1
                return {
                    type: "enabled",
                    item: { path: item.path, history: item.history.previous.history },
                }
        }
    }
    undoEnabled(): boolean {
        if (this.position >= this.history.length) {
            return false
        }
        const item = this.history[this.position]
        switch (item.history.previous.type) {
            case "first":
                return false

            case "hasPrevious":
                return true
        }
    }

    redo(): FormHistoryRestoreResult {
        if (this.position + 1 >= this.history.length) {
            return { type: "disabled" }
        }
        const item = this.history[this.position + 1]
        switch (item.history.previous.type) {
            case "first":
                return { type: "disabled" }

            case "hasPrevious":
                this.position = this.position + 1
                return { type: "enabled", item }
        }
    }
    redoEnabled(): boolean {
        if (this.position + 1 >= this.history.length) {
            return false
        }
        const item = this.history[this.position + 1]
        switch (item.history.previous.type) {
            case "first":
                return false

            case "hasPrevious":
                return true
        }
    }
}
