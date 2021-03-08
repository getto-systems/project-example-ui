import { BoardValue } from "../../../../../z_vendor/getto-application/board/kernel/data"
import { ConvertBoardFieldResult } from "../../../../../z_vendor/getto-application/board/validate_field/data"
import { LoginID, ValidateLoginIDError } from "./data"

// login id には技術的な制限はないが、使用可能な最大長さは定義しておく
export const LOGIN_ID_MAX_LENGTH = 100

export function convertLoginIDFromBoard(
    value: BoardValue,
): ConvertBoardFieldResult<LoginID, ValidateLoginIDError> {
    if (value.length === 0) {
        return { valid: false, err: EMPTY }
    }
    if (value.length > LOGIN_ID_MAX_LENGTH) {
        return { valid: false, err: TOO_LONG }
    }
    return { valid: true, value: markLoginID(value) }
}

const EMPTY: ValidateLoginIDError[] = [{ type: "empty" }]
const TOO_LONG: ValidateLoginIDError[] = [{ type: "too-long", maxLength: LOGIN_ID_MAX_LENGTH }]

function markLoginID(loginID: string): LoginID {
    return loginID as LoginID
}
