import { BoardValue } from "../../../../../../z_vendor/getto-application/board/kernel/data"
import { PasswordCharacterState } from "../Action/data"

export interface CheckPasswordCharacterMethod {
    (password: BoardValue): PasswordCharacterState
}
