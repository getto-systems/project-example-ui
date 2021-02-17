export type AuthSignLinkResource = Readonly<{
    href: {
        passwordLogin(): string
        passwordResetSession(): string
    }
}>
