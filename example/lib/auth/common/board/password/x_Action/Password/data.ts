export type PasswordCharacterState = Readonly<{ multiByte: boolean }>

export type ValidatePasswordError = "empty" | "too-long"
