export type LoginID = Readonly<{ loginID: Readonly<string> }>;
export type Password = Readonly<{ password: Readonly<string> }>;

// ascii : 1バイト文字のみ; complex : 2バイト以上の文字を含む
export type PasswordCharacter =
    Readonly<{ type: "ascii" }> |
    Readonly<{ type: "complex" }>;
