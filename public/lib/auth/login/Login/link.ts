export interface LoginLinkFactory {
    (): LoginLink
}

export interface LoginLink {
    passwordLogin(): string
    passwordResetSession(): string
}
