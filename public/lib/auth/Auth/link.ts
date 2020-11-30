export interface AuthLinkFactory {
    (): AuthLink
}

export interface AuthLink {
    passwordLogin(): string
    passwordResetSession(): string
}
