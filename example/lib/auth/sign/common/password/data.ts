export type Password = string & { Password: never }

export type PasswordCharacterState = Readonly<{ multiByte: boolean }>
