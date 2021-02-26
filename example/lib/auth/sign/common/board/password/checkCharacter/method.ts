import { BoardValue } from "../../../../../../z_vendor/getto-application/board/kernel/data"
import { PasswordCharacterState } from "../x_Action/Password/data"

export interface CheckPasswordCharacterMethod {
    (password: BoardValue): PasswordCharacterState
}
