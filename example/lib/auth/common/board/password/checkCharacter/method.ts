import { BoardValue } from "../../../../../z_getto/board/kernel/data"
import { PasswordCharacterState } from "../x_Action/Password/data"

export interface CheckPasswordCharacterMethod {
    (password: BoardValue): PasswordCharacterState
}
