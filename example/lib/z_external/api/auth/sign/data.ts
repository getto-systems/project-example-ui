export type RawAuthnInfo = Readonly<{ authnNonce: string; api: RawApiCredential }>
export type RawApiCredential = Readonly<{ apiNonce: string; apiRoles: string[] }>
