import { BoardValue } from "../../../../z_vendor/getto-application/board/kernel/data"
import { ConvertBoardFieldResult } from "../../../../z_vendor/getto-application/board/validateField/data"

export type LoginID = string & { LoginID: never }
function markLoginID(loginID: string): LoginID {
    return loginID as LoginID
}

// login id には技術的な制限はないが、使用可能な最大長さは定義しておく
export const LOGIN_ID_MAX_LENGTH = 100

export type ValidateLoginIDError = "empty" | "too-long"

export function convertLoginIDFromBoardValue(
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

const EMPTY: ValidateLoginIDError[] = ["empty"]
const TOO_LONG: ValidateLoginIDError[] = ["too-long"]
