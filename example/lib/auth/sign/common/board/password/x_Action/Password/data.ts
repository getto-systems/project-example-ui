// bcrypt を想定しているので、72 バイト以上ではいけない
export const PASSWORD_MAX_BYTES = 72

export type PasswordCharacterState = Readonly<{ multiByte: boolean }>

export type ValidatePasswordError = "empty" | "too-long"
