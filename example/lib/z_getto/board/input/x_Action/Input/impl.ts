import { InputBoardValueAction, InputBoardValueHandler } from "./action"

import { BoardValueStore } from "../../infra"

import { BoardValue, emptyBoardValue } from "../../../kernel/data"

export function newInputBoardValueAction(): InputBoardValueAction {
    return new Action()
}

class Action implements InputBoardValueAction {
    link: BoardValueStoreLink = { connect: false }

    inputHandlers: InputBoardValueHandler[] = []

    linkStore(store: BoardValueStore): void {
        this.link = { connect: true, store }
    }

    addInputHandler(handler: InputBoardValueHandler): void {
        this.inputHandlers = [...this.inputHandlers, handler]
    }
    triggerInputEvent(): void {
        this.inputHandlers.forEach((handler) => handler())
    }

    get(): BoardValue {
        if (!this.link.connect) {
            return emptyBoardValue
        }
        return this.link.store.get()
    }
    set(value: BoardValue): void {
        if (this.link.connect) {
            this.link.store.set(value)
        }
        this.triggerInputEvent()
    }
    clear(): void {
        this.set(emptyBoardValue)
    }

    terminate(): void {
        this.inputHandlers = []
    }
}

type BoardValueStoreLink =
    | Readonly<{ connect: false }>
    | Readonly<{ connect: true; store: BoardValueStore }>
