export type AuthSignLinkResource = Readonly<{
    href: {
        password_authenticate(): string
        password_reset(): string
    }
}>
