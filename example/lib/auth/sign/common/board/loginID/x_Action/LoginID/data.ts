// login id には技術的な制限はないが、使用可能な最大長さは定義しておく
export const LOGIN_ID_MAX_LENGTH = 100

export type ValidateLoginIDError = "empty" | "too-long"
