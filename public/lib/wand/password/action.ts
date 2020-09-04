import { Password, PasswordBoard, ValidPassword } from "./data";

export interface PasswordAction {
    initPasswordRecord(): PasswordRecord
}

export interface PasswordRecord {
    // TODO history が必要なやつに実装したら必要なくなる
    addChangedListener(listener: PasswordListener): void

    currentBoard(): PasswordBoard

    input(password: Password): PasswordBoard
    change(): PasswordBoard

    show(): PasswordBoard
    hide(): PasswordBoard

    validate(): ValidPassword
    clear(): void
}

export interface PasswordListener {
    (password: Password): void
}
