import { BoardValue } from "../../../../z_vendor/getto-application/board/kernel/data"
import { BoardFieldConvertResult } from "../../../../z_vendor/getto-application/board/validateField/data"

export type LoginID = string & { LoginID: never }

// login id には技術的な制限はないが、使用可能な最大長さは定義しておく
export const LOGIN_ID_MAX_LENGTH = 100

export type ValidateLoginIDError = "empty" | "too-long"

export function convertLoginID(
    value: BoardValue,
): BoardFieldConvertResult<LoginID, ValidateLoginIDError> {
    if (value.length === 0) {
        return { valid: false, err: EMPTY }
    }
    if (value.length > LOGIN_ID_MAX_LENGTH) {
        return { valid: false, err: TOO_LONG }
    }
    return { valid: true, value: (value as string) as LoginID }
}

const EMPTY: ValidateLoginIDError[] = ["empty"]
const TOO_LONG: ValidateLoginIDError[] = ["too-long"]
