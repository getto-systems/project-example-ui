import { Board } from "../infra"

import { BoardValue, emptyBoardValue } from "../data"

export function newBoard(): Board {
    return new MemoryBoard()
}

class MemoryBoard implements Board {
    board: Record<string, BoardValue> = {}

    get(name: string): BoardValue {
        const value = this.board[name]
        if (!value) {
            return emptyBoardValue
        }
        return value
    }
    set(name: string, value: BoardValue): void {
        this.board[name] = value
    }
    clear(name: string): void {
        delete this.board[name]
    }
}
